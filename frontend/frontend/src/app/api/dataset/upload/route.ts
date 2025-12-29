import { NextRequest, NextResponse } from 'next/server';
import { walrusService } from '@/services/walrus.service';

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Supported file types
const SUPPORTED_TYPES = [
  'text/csv',
  'application/json',
  'text/plain',
  'text/tab-separated-values',
  'application/octet-stream'
];

interface ValidationResult {
  isValid: boolean;
  rowCount?: number;
  columnCount?: number;
  dataType?: string;
  quality?: number;
  errors?: string[];
}

/**
 * Parse CSV/TSV line properly handling quoted fields
 */
function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote (double quote inside quoted field)
        current += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
        continue;
      }
    }
    
    if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
      continue;
    }
    
    current += char;
    i++;
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
}

/**
 * Validate dataset content
 */
function validateDataset(content: string, filename: string): ValidationResult {
  const errors: string[] = [];
  let rowCount = 0;
  let columnCount = 0;
  let dataType = 'unknown';
  
  try {
    // Determine data type from filename
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (ext === 'csv' || ext === 'tsv') {
      dataType = ext;
      const lines = content.trim().split('\n');
      rowCount = lines.length - 1; // Subtract header row
      
      if (lines.length > 0) {
        const delimiter = ext === 'csv' ? ',' : '\t';
        const headerCols = parseCsvLine(lines[0], delimiter).map(h => {
          // Remove surrounding quotes if present
          if (h.startsWith('"') && h.endsWith('"')) {
            return h.slice(1, -1).trim();
          }
          return h.trim();
        });
        columnCount = headerCols.length;
        
        // Check for consistent column count using proper CSV parsing
        const inconsistentRows = lines.slice(1).filter(line => {
          const cols = parseCsvLine(line, delimiter).map(col => {
            // Remove surrounding quotes if present
            if (col.startsWith('"') && col.endsWith('"')) {
              return col.slice(1, -1).trim();
            }
            return col.trim();
          });
          return cols.length !== columnCount;
        });
        
        if (inconsistentRows.length > 0) {
          errors.push(`${inconsistentRows.length} rows have inconsistent column count`);
        }
      }
      
      if (rowCount < 10) {
        errors.push('Dataset should have at least 10 rows for meaningful training');
      }
      
      if (columnCount < 2) {
        errors.push('Dataset should have at least 2 columns (features + target)');
      }
      
    } else if (ext === 'json') {
      dataType = 'json';
      const parsed = JSON.parse(content);
      
      if (Array.isArray(parsed)) {
        rowCount = parsed.length;
        if (parsed.length > 0) {
          columnCount = Object.keys(parsed[0]).length;
        }
        
        if (rowCount < 10) {
          errors.push('Dataset should have at least 10 records');
        }
      } else {
        errors.push('JSON should be an array of objects');
      }
      
    } else if (ext === 'txt') {
      dataType = 'text';
      const lines = content.trim().split('\n');
      rowCount = lines.length;
      
      if (rowCount < 10) {
        errors.push('Text file should have at least 10 lines');
      }
    } else {
      dataType = 'binary';
      rowCount = content.length;
    }
    
    // Calculate quality score
    let quality = 100;
    if (errors.length > 0) quality -= errors.length * 15;
    if (rowCount < 100) quality -= 10;
    if (rowCount < 50) quality -= 10;
    quality = Math.max(0, Math.min(100, quality));
    
    return {
      isValid: errors.length === 0,
      rowCount,
      columnCount: columnCount > 0 ? columnCount : undefined,
      dataType,
      quality,
      errors: errors.length > 0 ? errors : undefined
    };
    
  } catch (error) {
    return {
      isValid: false,
      dataType,
      errors: [`Failed to parse dataset: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * POST: Upload dataset to Walrus
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Dataset Upload API Called ===');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('File received:', file.name, 'size:', file.size, 'type:', file.type);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }
    
    // Validate file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['csv', 'json', 'txt', 'tsv', 'data'];
    
    if (!ext || !validExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Supported: CSV, JSON, TXT, TSV' },
        { status: 400 }
      );
    }
    
    // Read file content for validation
    console.log('Reading file content for validation...');
    const arrayBuffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(arrayBuffer);
    
    // Validate dataset
    console.log('Validating dataset structure...');
    const validation = validateDataset(content, file.name);
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dataset validation failed',
          validation 
        },
        { status: 400 }
      );
    }
    
    console.log('Validation successful:', validation);
    
    // Upload to Walrus
    console.log('Uploading to Walrus...');
    const uploadResult = await walrusService.uploadBlob(new Uint8Array(arrayBuffer), 10); // Store for 10 epochs
    
    console.log('Upload successful:', uploadResult);
    
    // Return success response
    return NextResponse.json({
      success: true,
      cid: uploadResult.blobId || uploadResult.cid,
      blobId: uploadResult.blobId || uploadResult.cid,
      filename: file.name,
      size: file.size,
      validation: {
        ...validation,
        isValid: true
      },
      endEpoch: uploadResult.endEpoch,
      url: walrusService.getBlobUrl(uploadResult.blobId || uploadResult.cid)
    });
    
  } catch (error: any) {
    console.error('Dataset upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload dataset',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve dataset from Walrus
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blobId = searchParams.get('blobId') || searchParams.get('cid');
    
    if (!blobId) {
      return NextResponse.json(
        { success: false, error: 'Blob ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Downloading dataset from Walrus:', blobId);
    
    // Download from Walrus
    const data = await walrusService.downloadBlob(blobId);
    
    // Convert Uint8Array to Buffer for NextResponse
    const buffer = Buffer.from(data);
    
    // Return as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="dataset-${blobId.slice(0, 8)}.data"`
      }
    });
    
  } catch (error: any) {
    console.error('Dataset download error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to download dataset' 
      },
      { status: 500 }
    );
  }
}