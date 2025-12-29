import { NextRequest, NextResponse } from 'next/server';

// Maximum file size for validation: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface ValidationResult {
  isValid: boolean;
  rowCount?: number;
  columnCount?: number;
  dataType?: string;
  quality?: number;
  errors?: string[];
  warnings?: string[];
  statistics?: {
    fileSize: number;
    hasHeader?: boolean;
    encoding?: string;
    sampleData?: string;
  };
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
 * Validate CSV/TSV dataset
 */
function validateCsvTsv(content: string, delimiter: string): Partial<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const lines = content.trim().split('\n').filter(line => line.trim().length > 0);
  const rowCount = lines.length - 1; // Subtract header
  
  if (lines.length === 0) {
    errors.push('File is empty');
    return { isValid: false, errors };
  }
  
  // Parse header using proper CSV parsing
  const header = parseCsvLine(lines[0], delimiter).map(h => {
    // Remove surrounding quotes if present
    if (h.startsWith('"') && h.endsWith('"')) {
      return h.slice(1, -1).trim();
    }
    return h.trim();
  });
  const columnCount = header.length;
  
  // Check header
  if (columnCount < 2) {
    errors.push('Dataset should have at least 2 columns (features + target)');
  }
  
  // Check for empty header values
  const emptyHeaders = header.filter(h => h === '').length;
  if (emptyHeaders > 0) {
    warnings.push(`${emptyHeaders} columns have empty headers`);
  }
  
  // Check data rows
  if (rowCount < 10) {
    warnings.push('Dataset has fewer than 10 rows - may be insufficient for training');
  }
  
  // Check for consistent column count using proper CSV parsing
  let inconsistentRows = 0;
  let emptyRows = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], delimiter).map(col => {
      // Remove surrounding quotes if present
      if (col.startsWith('"') && col.endsWith('"')) {
        return col.slice(1, -1).trim();
      }
      return col.trim();
    });
    
    if (cols.length !== columnCount) {
      inconsistentRows++;
    }
    if (cols.every(col => col === '')) {
      emptyRows++;
    }
  }
  
  if (inconsistentRows > 0) {
    errors.push(`${inconsistentRows} rows have inconsistent column count`);
  }
  
  if (emptyRows > 0) {
    warnings.push(`${emptyRows} empty rows detected`);
  }
  
  // Sample data (first 3 rows)
  const sampleData = lines.slice(0, 4).join('\n');
  
  return {
    rowCount,
    columnCount,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate JSON dataset
 */
function validateJson(content: string): Partial<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const parsed = JSON.parse(content);
    
    if (!Array.isArray(parsed)) {
      errors.push('JSON should be an array of objects for training datasets');
      return { isValid: false, errors };
    }
    
    const rowCount = parsed.length;
    
    if (rowCount === 0) {
      errors.push('JSON array is empty');
      return { isValid: false, errors };
    }
    
    if (rowCount < 10) {
      warnings.push('Dataset has fewer than 10 records - may be insufficient for training');
    }
    
    // Check first object for structure
    const firstObj = parsed[0];
    if (typeof firstObj !== 'object' || firstObj === null) {
      errors.push('JSON array should contain objects');
      return { isValid: false, errors };
    }
    
    const columnCount = Object.keys(firstObj).length;
    
    if (columnCount < 2) {
      warnings.push('Each record should have at least 2 fields (features + target)');
    }
    
    // Check for consistent keys across records
    const firstKeys = Object.keys(firstObj).sort();
    let inconsistentRecords = 0;
    
    for (let i = 1; i < Math.min(parsed.length, 100); i++) {
      const obj = parsed[i];
      if (typeof obj !== 'object' || obj === null) {
        inconsistentRecords++;
        continue;
      }
      const keys = Object.keys(obj).sort();
      if (JSON.stringify(keys) !== JSON.stringify(firstKeys)) {
        inconsistentRecords++;
      }
    }
    
    if (inconsistentRecords > 0) {
      warnings.push(`${inconsistentRecords} records have inconsistent structure`);
    }
    
    // Sample data
    const sampleData = JSON.stringify(parsed.slice(0, 3), null, 2);
    
    return {
      rowCount,
      columnCount,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`);
    return { isValid: false, errors };
  }
}

/**
 * Validate text dataset
 */
function validateText(content: string): Partial<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const lines = content.trim().split('\n').filter(line => line.trim().length > 0);
  const rowCount = lines.length;
  
  if (rowCount === 0) {
    errors.push('File is empty');
    return { isValid: false, errors };
  }
  
  if (rowCount < 10) {
    warnings.push('Text file has fewer than 10 lines - may be insufficient for training');
  }
  
  // Sample data
  const sampleData = lines.slice(0, 10).join('\n');
  
  return {
    rowCount,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Main validation function
 */
function validateDataset(file: File, content: string): ValidationResult {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  let dataType = 'unknown';
  let result: Partial<ValidationResult> = {};
  
  try {
    if (ext === 'csv') {
      dataType = 'csv';
      result = validateCsvTsv(content, ',');
    } else if (ext === 'tsv') {
      dataType = 'tsv';
      result = validateCsvTsv(content, '\t');
    } else if (ext === 'json') {
      dataType = 'json';
      result = validateJson(content);
    } else if (ext === 'txt' || ext === 'data') {
      dataType = 'text';
      result = validateText(content);
    } else {
      return {
        isValid: false,
        dataType: ext,
        errors: [`Unsupported file type: ${ext}`]
      };
    }
    
    // Calculate quality score
    let quality = 100;
    
    if (result.errors && result.errors.length > 0) {
      quality -= result.errors.length * 20;
    }
    
    if (result.warnings && result.warnings.length > 0) {
      quality -= result.warnings.length * 10;
    }
    
    if (result.rowCount && result.rowCount < 100) {
      quality -= 15;
    }
    
    if (result.rowCount && result.rowCount < 50) {
      quality -= 15;
    }
    
    quality = Math.max(0, Math.min(100, quality));
    
    return {
      isValid: !result.errors || result.errors.length === 0,
      dataType,
      quality,
      ...result,
      statistics: {
        fileSize: file.size,
        encoding: 'utf-8',
        ...result.statistics
      }
    };
    
  } catch (error) {
    return {
      isValid: false,
      dataType,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * POST: Validate dataset without uploading
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Dataset Validation API Called ===');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('Validating dataset:', file.name);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          validation: {
            isValid: false,
            errors: [`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`]
          }
        },
        { status: 400 }
      );
    }
    
    // Check file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['csv', 'json', 'txt', 'tsv', 'data'];
    
    if (!ext || !validExtensions.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          validation: {
            isValid: false,
            errors: [`Unsupported file type: .${ext}. Supported: ${validExtensions.join(', ')}`]
          }
        },
        { status: 400 }
      );
    }
    
    // Read and validate content
    const arrayBuffer = await file.arrayBuffer();
    const content = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
    
    const validation = validateDataset(file, content);
    
    console.log('Validation result:', validation);
    
    return NextResponse.json({
      success: true,
      filename: file.name,
      size: file.size,
      validation
    });
    
  } catch (error: any) {
    console.error('Validation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to validate dataset',
        validation: {
          isValid: false,
          errors: [error.message || 'Validation failed']
        }
      },
      { status: 500 }
    );
  }
}