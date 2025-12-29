import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * POST: Pause training (proxies to backend)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        detail: 'Session ID is required' 
      }, { status: 400 });
    }
    
    console.log('Pausing training for session:', sessionId);
    
    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/training/pause/${sessionId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        detail: errorData.detail || 'Failed to pause training'
      }, { status: response.status });
    }
    
    return NextResponse.json({ 
      success: true,
      session_id: sessionId,
      message: 'Training paused'
    });
    
  } catch (error) {
    console.error('Failed to pause training:', error);
    return NextResponse.json({ 
      success: false, 
      detail: error instanceof Error ? error.message : 'Failed to connect to backend'
    }, { status: 500 });
  }
}