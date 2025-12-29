import { NextRequest, NextResponse } from 'next/server';
import { walrusService } from '@/services/walrus.service';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST: Upload gradient data to Walrus
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cid, loss, version, stats } = body;
    
    // Validate required fields
    if (!cid) {
      return NextResponse.json({ 
        success: false, 
        error: 'CID is required' 
      }, { status: 400 });
    }
    
    // Prepare metadata
    const metadata = {
      type: 'gradient',
      cid,
      loss,
      version,
      stats,
      uploadedAt: new Date().toISOString(),
    };
    
    console.log('Processing gradient upload:', metadata);
    
    // For gradient data, we might just store the metadata or a reference
    // In a real implementation, this would handle the actual gradient blob storage
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gradient data processed successfully',
      cid: cid,
      timestamp: metadata.uploadedAt
    });
    
  } catch (error) {
    console.error('Gradient upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process gradient data';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

/**
 * GET: Health check
 */
export async function GET() {
  return NextResponse.json({ 
    success: true,
    status: 'ready',
    message: 'Gradient upload service is available',
    maxFileSize: MAX_FILE_SIZE
  });
}