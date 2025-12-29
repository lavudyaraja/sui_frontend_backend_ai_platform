import { NextRequest, NextResponse } from 'next/server';
import { walrusService } from '@/services/walrus.service';

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  'text/csv',
  'application/json',
  'text/plain',
  'application/octet-stream'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.csv', '.json', '.txt', '.data', '.tsv'];

interface DatasetMetadata {
  type: 'dataset';
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  validation: {
    isValid: boolean;
    rowCount?: number;
    columnCount?: number;
    dataType?: string;
    errors?: string[];
  };
}

/**
 * Validate dataset file
 */
async function validateDataset(file: File): Promise<DatasetMetadata['validation']> {
  try {
    const text = await file.text();
    
    // Detect file type and validate
    if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
      return validateCSV(text, file.name.endsWith('.tsv'));
    } else if (file.name.endsWith('.json')) {
      return validateJSON(text);
    } else {
      return {
        isValid: true,
        dataType: 'raw',
        rowCount: text.split('\n').length
      };
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Validation failed']
    };
  }
}

/**
 * Validate CSV/TSV format
 */
function validateCSV(text: string, isTSV: boolean = false): DatasetMetadata['validation'] {
  const errors: string[] = [];
  const delimiter = isTSV ? '\t' : ',';
  
  const lines = text.trim().split('\n');
  
  if (lines.length === 0) {
    return {
      isValid: false,
      errors: ['File is empty']
    };
  }
  
  // Check header
  const headers = lines[0].split(delimiter);
  
  if (headers.length === 0) {
    errors.push('No columns found in header');
  }
  
  // Validate rows
  let validRows = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].trim();
    if (row.length === 0) continue;
    
    const columns = row.split(delimiter);
    if (columns.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${columns.length})`);
    } else {
      validRows++;
    }
  }
  
  return {
    isValid: errors.length === 0,
    rowCount: validRows,
    columnCount: headers.length,
    dataType: 'csv',
    errors: errors.length > 0 ? errors.slice(0, 5) : undefined // Limit to 5 errors
  };
}

/**
 * Validate JSON format
 */
function validateJSON(text: string): DatasetMetadata['validation'] {
  try {
    const data = JSON.parse(text);
    
    if (Array.isArray(data)) {
      const rowCount = data.length;
      const columnCount = rowCount > 0 && typeof data[0] === 'object' 
        ? Object.keys(data[0]).length 
        : 0;
      
      return {
        isValid: true,
        rowCount,
        columnCount,
        dataType: 'json'
      };
    } else if (typeof data === 'object') {
      return {
        isValid: true,
        dataType: 'json',
        rowCount: 1
      };
    } else {
      return {
        isValid: false,
        errors: ['Invalid JSON structure']
      };
    }
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid JSON format: ' + (error instanceof Error ? error.message : 'Parse error')]
    };
  }
}

/**
 * POST: Upload dataset to Walrus
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
        error: 'No file provided' 
      }, { status: 400 });
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false, 
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }
    
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json({ 
        success: false, 
        error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}` 
      }, { status: 400 });
    }
    
    // Validate dataset content
    console.log('Validating dataset:', file.name);
    const validation = await validateDataset(file);
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dataset validation failed',
        details: validation.errors 
      }, { status: 400 });
    }
    
    // Convert file to buffer for Walrus upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Prepare metadata
    const metadata: DatasetMetadata = {
      type: 'dataset',
      filename: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      validation
    };
    
    console.log('Uploading dataset to Walrus:', metadata);
    
    // Upload to Walrus - Fix: Pass epochs (number) as second parameter, not metadata
    const result = await walrusService.uploadBlob(buffer, 5); // Using 5 epochs as default
    
    console.log('Dataset uploaded successfully:', result.cid);
    
    return NextResponse.json({ 
      success: true, 
      cid: result.cid,
      filename: file.name,
      size: file.size,
      validation,
      message: 'Dataset uploaded and validated successfully'
    });
    
  } catch (error) {
    console.error('Dataset upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload dataset';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

/**
 * GET: Check dataset by CID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cid = searchParams.get('cid');
    
    if (cid) {
      // Retrieve dataset from Walrus
      const result = await walrusService.downloadBlob(cid);
      
      return NextResponse.json({ 
        success: true,
        cid,
        exists: true,
        size: result.byteLength,
        message: 'Dataset found'
      });
    }
    
    // Return service status
    return NextResponse.json({ 
      success: true,
      status: 'ready',
      message: 'Dataset upload service is available',
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_EXTENSIONS
    });
    
  } catch (error) {
    console.error('Dataset retrieval error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to retrieve dataset' 
    }, { status: 500 });
  }
}

/**
 * DELETE: Remove dataset from Walrus
 */
export async function DELETE(request: NextRequest) {
  try {
    const { cid } = await request.json();
    
    if (!cid) {
      return NextResponse.json({ 
        success: false, 
        error: 'CID is required' 
      }, { status: 400 });
    }
    
    // Note: Walrus may not support deletion - this is a placeholder
    console.log('Dataset deletion requested:', cid);
    
    return NextResponse.json({ 
      success: true,
      message: 'Dataset deletion requested',
      note: 'Walrus storage is immutable - data cannot be deleted but will expire'
    });
    
  } catch (error) {
    console.error('Dataset deletion error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete dataset' 
    }, { status: 500 });
  }
}