import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * GET: Get training status (proxies to backend)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        detail: 'Session ID is required' 
      }, { status: 400 });
    }
    
    console.log('Getting status for session:', sessionId);
    
    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/training/status/${sessionId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          success: false, 
          detail: 'Session not found',
          session_not_found: true
        }, { status: 404 });
      }
      
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        detail: errorData.detail || 'Failed to get status'
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Return the data directly without wrapping in session property
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Failed to get status:', error);
    return NextResponse.json({ 
      success: false, 
      detail: error instanceof Error ? error.message : 'Failed to connect to backend'
    }, { status: 500 });
  }
}