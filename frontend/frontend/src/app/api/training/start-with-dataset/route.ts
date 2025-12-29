import { NextRequest, NextResponse } from 'next/server';
import { walrusService } from '@/services/walrus.service';

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.csv', '.json', '.txt', '.data', '.tsv'];

/**
 * Helper: backend base URL (FastAPI). Prefer explicit env, fallback to localhost:8000
 * Make sure to set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 in frontend/.env.local
 */
function getBackendBase(): string {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
}

// Active sessions store (keyed by backend session id)
const activeSessions = new Map<string, any>();

interface TrainingRequest {
  model_type: string;
  epochs: number;
  batch_size: number;
  learning_rate: number;
  optimizer?: string;
  validation_split?: number;
  datasetCID?: string;
}

/**
 * POST: Start training with dataset upload
 */
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file presence
    if (!file) {
      return NextResponse.json({
        success: false,
        detail: 'No file provided'
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        detail: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 });
    }

    // Validate file extension
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        success: false,
        detail: `File type not allowed. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 });
    }

    // Get training parameters
    const model_type = (formData.get('model_type') as string) || 'mlp';
    const epochs = parseInt((formData.get('epochs') as string) || '10', 10);
    const batch_size = parseInt((formData.get('batch_size') as string) || '32', 10);
    const learning_rate = parseFloat((formData.get('learning_rate') as string) || '0.001');
    const optimizer = (formData.get('optimizer') as string) || 'adam';
    const validation_split = parseFloat((formData.get('validation_split') as string) || '0.2');

    // Upload dataset to Walrus
    console.log('Uploading dataset to Walrus:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadResult = await walrusService.uploadBlob(buffer);
    const datasetCID = uploadResult.cid;

    console.log('Dataset uploaded successfully:', datasetCID);

    // Now call backend FastAPI to start training and obtain backend session id
    const backendBase = getBackendBase();
    const startUrl = `${backendBase}/api/training/start`;

    const startResp = await fetch(startUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_type: model_type,
        epochs,
        batch_size: batch_size,
        learning_rate: learning_rate,
        optimizer,
        dataset_cid: datasetCID,
        validation_split: validation_split
      })
    });

    if (!startResp.ok) {
      let message = `Failed to start backend training (${startResp.status})`;
      try {
        const err = await startResp.json();
        message = err.detail || err.message || message;
      } catch (_) { /* ignore */ }
      console.error('Backend start error:', message);
      return NextResponse.json({ success: false, detail: message }, { status: startResp.status });
    }

    const startData = await startResp.json();
    // Accept various key names
    const backendSessionId: string | undefined = startData.sessionId || startData.session_id || startData.session || startData.id;

    if (!backendSessionId) {
      console.error('Backend did not return session id:', startData);
      return NextResponse.json({ success: false, detail: 'Backend did not return a session id' }, { status: 500 });
    }

    // Initialize session record locally keyed by backend session id
    const sessionRecord = {
      sessionId: backendSessionId,
      status: 'preparing',
      dataset_cid: datasetCID,
      startTime: new Date().toISOString(),
      progress: 0,
      currentEpoch: 0,
      totalEpochs: epochs,
      loss: null,
      accuracy: null,
      logs: []
    };

    activeSessions.set(backendSessionId, sessionRecord);

    console.log('Training started (backend session):', backendSessionId, {
      model_type, epochs, batch_size, learning_rate, optimizer, validation_split, datasetCID
    });

    // Start background poller that updates activeSessions from backend status
    pollBackendStatusAndSync(backendSessionId).catch(err => {
      console.error('Background poller error for', backendSessionId, err);
      const s = activeSessions.get(backendSessionId);
      if (s) {
        s.status = 'failed';
        s.error = err instanceof Error ? err.message : String(err);
        s.endTime = new Date().toISOString();
      }
    });

    // Return the backend session id immediately to the caller
    return NextResponse.json({
      success: true,
      session_id: backendSessionId,
      sessionId: backendSessionId,
      dataset_cid: datasetCID,
      status: 'preparing',
      message: 'Training started successfully (backend)'
    });

  } catch (error) {
    console.error('Training with dataset error:', error);
    return NextResponse.json({
      success: false,
      detail: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * Background poller: fetch backend /status/{sessionId} repeatedly and update activeSessions
 */
async function pollBackendStatusAndSync(sessionId: string) {
  const backendBase = getBackendBase();
  const statusUrl = `${backendBase}/api/training/status/${encodeURIComponent(sessionId)}`;

  // Poll until completed/failed/stopped
  let keepPolling = true;
  let consecutive404 = 0;

  while (keepPolling) {
    try {
      const resp = await fetch(statusUrl);
      if (resp.status === 404) {
        // small race condition allowance
        consecutive404++;
        if (consecutive404 > 8) {
          throw new Error('Session not found on backend after multiple retries');
        }
        await new Promise(r => setTimeout(r, 500));
        continue;
      }
      consecutive404 = 0;

      if (!resp.ok) {
        // server error, backoff a bit
        const text = await resp.text().catch(() => '');
        console.warn(`Backend status returned ${resp.status}: ${text}`);
        await new Promise(r => setTimeout(r, 800));
        continue;
      }

      const data = await resp.json();
      const session = activeSessions.get(sessionId);
      if (!session) {
        // If session removed for any reason, stop syncing
        return;
      }

      // data contains status, progress, logs, epochMetrics, result, etc.
      session.status = data.status || session.status;
      if (data.progress) {
        // support both numeric percentage or progress object
        if (typeof data.progress === 'number') {
          session.progress = data.progress;
        } else if (data.progress.percentage !== undefined) {
          session.progress = data.progress.percentage;
        } else {
          session.progress = session.progress || 0;
        }
      }
      session.currentEpoch = data.progress?.epoch ?? session.currentEpoch;
      session.loss = data.progress?.loss ?? session.loss;
      session.accuracy = data.progress?.accuracy ?? session.accuracy;

      // append logs if provided
      if (Array.isArray(data.logs)) {
        // naive append (avoid duplicates in production by dedupe)
        session.logs = (session.logs || []).concat(data.logs);
      }

      if (data.epochMetrics && Array.isArray(data.epochMetrics)) {
        session.epochMetrics = data.epochMetrics;
      }

      if (data.result) {
        session.result = data.result;
      }

      if (data.status === 'completed' || data.status === 'failed' || data.status === 'stopped') {
        session.endTime = new Date().toISOString();
        keepPolling = false;
      }

      // brief wait between polls
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error('Error polling backend status for', sessionId, err);
      // on error, wait a bit and retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

/**
 * GET: Get training service status
 * Query param: ?sessionId=<backend-session-id>
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId') || searchParams.get('session_id');

    if (sessionId) {
      const session = activeSessions.get(sessionId);
      if (!session) {
        return NextResponse.json({
          success: false,
          detail: 'Session not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        session
      });
    }

    // Return service status summary
    const activeSessionsArray = Array.from(activeSessions.values());
    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'Training service is available',
      activeSessions: activeSessionsArray.length,
      sessions: activeSessionsArray
    });

  } catch (error) {
    console.error('Training status error:', error);
    return NextResponse.json({
      success: false,
      detail: error instanceof Error ? error.message : 'Failed to get status'
    }, { status: 500 });
  }
}
