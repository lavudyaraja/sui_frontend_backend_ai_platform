import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface TrainingRequest {
  action: 'start' | 'pause' | 'resume' | 'stop' | 'status';
  sessionId?: string;
  config?: {
    modelType: 'mlp' | 'cnn' | 'rnn' | 'transformer';
    epochs: number;
    batchSize: number;
    learningRate: number;
    datasetCID?: string;
  };
}

/**
 * POST: Handle training actions (proxies to backend)
 */
export async function POST(request: NextRequest) {
  try {
    const body: TrainingRequest = await request.json();
    const { action, sessionId, config } = body;
    
    console.log('Training action:', action, sessionId);
    
    switch (action) {
      case 'start':
        return await handleStartTraining(config);
      
      case 'pause':
        return await handlePauseTraining(sessionId);
      
      case 'resume':
        return await handleResumeTraining(sessionId);
      
      case 'stop':
        return await handleStopTraining(sessionId);
      
      case 'status':
        return await handleGetStatus(sessionId);
      
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action' 
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Training API error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * Start training session (calls backend)
 */
async function handleStartTraining(config?: TrainingRequest['config']) {
  if (!config) {
    return NextResponse.json({ 
      success: false, 
      error: 'Training configuration is required' 
    }, { status: 400 });
  }
  
  try {
    console.log('Starting training with config:', config);
    
    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/training/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_type: config.modelType,
        epochs: config.epochs,
        batch_size: config.batchSize,
        learning_rate: config.learningRate,
        dataset_cid: config.datasetCID,
        optimizer: 'adam',
        validation_split: 0.2
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorData.detail || 'Failed to start training'
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    console.log('Training started on backend:', data.session_id);
    
    return NextResponse.json({ 
      success: true, 
      sessionId: data.session_id,
      message: 'Training started successfully',
      status: 'preparing'
    });
    
  } catch (error) {
    console.error('Failed to start training:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect to backend'
    }, { status: 500 });
  }
}

/**
 * Pause training (calls backend)
 */
async function handlePauseTraining(sessionId?: string) {
  if (!sessionId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Session ID is required' 
    }, { status: 400 });
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/training/pause/${sessionId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        error: errorData.detail || 'Failed to pause training'
      }, { status: response.status });
    }
    
    return NextResponse.json({ 
      success: true,
      sessionId,
      message: 'Training paused'
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to pause training'
    }, { status: 500 });
  }
}

/**
 * Resume training (calls backend)
 */
async function handleResumeTraining(sessionId?: string) {
  if (!sessionId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Session ID is required' 
    }, { status: 400 });
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/training/resume/${sessionId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        error: errorData.detail || 'Failed to resume training'
      }, { status: response.status });
    }
    
    return NextResponse.json({ 
      success: true,
      sessionId,
      message: 'Training resumed'
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to resume training'
    }, { status: 500 });
  }
}

/**
 * Stop training (calls backend)
 */
async function handleStopTraining(sessionId?: string) {
  if (!sessionId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Session ID is required' 
    }, { status: 400 });
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/training/stop/${sessionId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        error: errorData.detail || 'Failed to stop training'
      }, { status: response.status });
    }
    
    return NextResponse.json({ 
      success: true,
      sessionId,
      message: 'Training stopped'
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to stop training'
    }, { status: 500 });
  }
}

/**
 * Get training status (calls backend)
 */
async function handleGetStatus(sessionId?: string) {
  if (!sessionId) {
    // Return all sessions from backend
    try {
      const response = await fetch(`${BACKEND_URL}/api/training/sessions`);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
    
    return NextResponse.json({ 
      success: true,
      sessions: [],
      count: 0
    });
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/training/status/${sessionId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          success: false, 
          error: 'Session not found',
          session_not_found: true
        }, { status: 404 });
      }
      
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        error: errorData.detail || 'Failed to get status'
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      session: {
        sessionId,
        status: data.status,
        progress: data.progress?.percentage || 0,
        currentEpoch: data.progress?.epoch || 0,
        totalEpochs: data.progress?.totalBatches || 0,
        loss: data.progress?.loss,
        accuracy: data.progress?.accuracy,
        result: data.result,
        error: data.error
      }
    });
    
  } catch (error) {
    console.error('Failed to get status:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get status'
    }, { status: 500 });
  }
}

/**
 * GET: Get training service status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    
    if (sessionId) {
      // Get specific session status from backend
      console.log('Getting status for session:', sessionId);
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/training/status/${sessionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Session not found on backend:', sessionId);
            return NextResponse.json({ 
              success: false, 
              error: 'Session not found. It may have been lost due to server restart.',
              session_not_found: true
            }, { status: 404 });
          }
          
          const errorData = await response.json();
          return NextResponse.json({ 
            success: false, 
            error: errorData.detail || 'Failed to get status'
          }, { status: response.status });
        }
        
        const data = await response.json();
        
        // Transform backend response to frontend format
        return NextResponse.json({ 
          success: true,
          session: {
            sessionId,
            status: data.status,
            progress: data.progress?.percentage || 0,
            currentEpoch: data.progress?.epoch || 0,
            totalEpochs: data.progress?.totalBatches || 0,
            loss: data.progress?.loss,
            accuracy: data.progress?.accuracy,
            logs: data.logs,
            epochMetrics: data.epochMetrics,
            result: data.result,
            error: data.error
          }
        });
        
      } catch (error) {
        console.error('Backend connection error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to connect to training backend',
          backend_error: true
        }, { status: 503 });
      }
    }
    
    // Return service status
    try {
      const response = await fetch(`${BACKEND_URL}/api/training/sessions`);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ 
          success: true,
          status: 'ready',
          message: 'Training service is available',
          activeSessions: data.count || 0,
          sessions: data.sessions || []
        });
      }
    } catch (error) {
      console.error('Backend connection error:', error);
    }
    
    return NextResponse.json({ 
      success: true,
      status: 'ready',
      message: 'Training service is available',
      activeSessions: 0,
      sessions: []
    });
    
  } catch (error) {
    console.error('Training status error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get status' 
    }, { status: 500 });
  }
}

/**
 * DELETE: Clean up completed/failed sessions (calls backend)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (sessionId) {
      // Delete specific session on backend
      const response = await fetch(`${BACKEND_URL}/api/training/stop/${sessionId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        return NextResponse.json({ 
          success: true,
          message: 'Session deleted'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Cleanup completed'
    });
    
  } catch (error) {
    console.error('Session cleanup error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to clean up sessions' 
    }, { status: 500 });
  }
}