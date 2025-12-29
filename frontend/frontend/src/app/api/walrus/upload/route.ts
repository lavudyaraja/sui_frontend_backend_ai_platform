import { NextRequest, NextResponse } from 'next/server';
import { walrusService } from '@/services/walrus.service';

// Maximum payload size: 50MB
const MAX_PAYLOAD_SIZE = 50 * 1024 * 1024;

/**
 * POST: Upload gradients to Walrus
 */
export async function POST(request: NextRequest) {
  try {
    // Get JSON body
    const body = await request.json();
    const { gradients } = body;
    
    // Validate payload
    if (!gradients) {
      return NextResponse.json({ 
        success: false, 
        detail: 'No gradients data provided' 
      }, { status: 400 });
    }
    
    // Convert gradients to buffer for Walrus upload
    let buffer: Uint8Array;
    
    if (gradients instanceof Uint8Array) {
      buffer = gradients;
    } else if (Array.isArray(gradients)) {
      buffer = new Uint8Array(gradients);
    } else if (typeof gradients === 'object') {
      // Convert object to JSON string then to buffer
      const jsonString = JSON.stringify(gradients);
      const textEncoder = new TextEncoder();
      buffer = textEncoder.encode(jsonString);
    } else {
      return NextResponse.json({ 
        success: false, 
        detail: 'Invalid gradients format' 
      }, { status: 400 });
    }
    
    // Check buffer size
    if (buffer.length > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ 
        success: false, 
        detail: `Gradients data exceeds maximum allowed size of ${MAX_PAYLOAD_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }
    
    // Prepare metadata
    const metadata = {
      type: 'gradients',
      uploadedAt: new Date().toISOString(),
      size: buffer.length
    };
    
    console.log('Uploading gradients to Walrus, size:', buffer.length);
    
    // Upload to Walrus (using 5 epochs as default)
    const result = await walrusService.uploadBlob(buffer);
    
    console.log('Gradients uploaded successfully:', result.cid);
    
    // Generate URL for accessing the blob
    const url = walrusService.getBlobUrl(result.cid);
    
    return NextResponse.json({ 
      success: true, 
      cid: result.cid,
      url: url,
      message: 'Gradients uploaded successfully'
    });
    
  } catch (error) {
    console.error('Walrus upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload to Walrus';
    
    return NextResponse.json({ 
      success: false, 
      detail: errorMessage 
    }, { status: 500 });
  }
}

/**
 * GET: Upload service status
 */
export async function GET() {
  return NextResponse.json({ 
    success: true,
    status: 'ready',
    message: 'Walrus upload service is available',
    maxPayloadSize: MAX_PAYLOAD_SIZE
  });
}