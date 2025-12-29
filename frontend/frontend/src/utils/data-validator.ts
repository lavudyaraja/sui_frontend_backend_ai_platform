/**
 * Data validation utilities for dataset validation in the training process
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  rowCount?: number;
  columnCount?: number;
  dataType?: string;
  preview?: string[];
}

/**
 * Validate CSV data content
 * @param content The CSV content as string
 * @returns ValidationResult with validation details
 */
export function validateCSVData(content: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  try {
    // Split into lines
    const lines = content.trim().split(/\r?\n/);
    
    if (lines.length === 0) {
      result.isValid = false;
      result.errors.push('File is empty');
      return result;
    }

    // Get headers
    const headers = lines[0].split(',');
    result.columnCount = headers.length;
    result.rowCount = lines.length - 1; // Exclude header row
    
    // Basic validation checks
    if (headers.length < 2) {
      result.isValid = false;
      result.errors.push('CSV must have at least 2 columns');
    }
    
    // Check for empty headers
    const emptyHeaders = headers.filter(header => header.trim() === '').length;
    if (emptyHeaders > 0) {
      result.isValid = false;
      result.errors.push(`Found ${emptyHeaders} empty column headers`);
    }
    
    // Validate data rows
    for (let i = 1; i < Math.min(lines.length, 6); i++) { // Check first 5 rows
      const row = lines[i];
      if (row.trim() === '') {
        result.isValid = false;
        result.errors.push(`Row ${i + 1} is empty`);
        continue;
      }
      
      const values = row.split(',');
      if (values.length !== headers.length) {
        result.isValid = false;
        result.errors.push(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      }
    }
    
    // Create preview
    result.preview = lines.slice(0, 5);
    
    // Determine data type
    result.dataType = 'CSV';
    
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Validate JSON data content
 * @param content The JSON content as string
 * @returns ValidationResult with validation details
 */
export function validateJSONData(content: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  try {
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      result.isValid = false;
      result.errors.push('JSON data must be an array');
      return result;
    }
    
    if (data.length === 0) {
      result.isValid = false;
      result.errors.push('JSON array is empty');
      return result;
    }
    
    result.rowCount = data.length;
    
    // Check if all items are objects
    const nonObjects = data.filter(item => typeof item !== 'object' || item === null).length;
    if (nonObjects > 0) {
      result.isValid = false;
      result.errors.push(`Found ${nonObjects} non-object items in array`);
    }
    
    // Get column count from first object
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      result.columnCount = Object.keys(data[0]).length;
      result.preview = data.slice(0, 5).map(item => JSON.stringify(item));
    }
    
    result.dataType = 'JSON';
    
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Validate TXT/TSV data content
 * @param content The TXT/TSV content as string
 * @param delimiter The delimiter used (default: tab for TSV)
 * @returns ValidationResult with validation details
 */
export function validateDelimitedData(content: string, delimiter: string = '\t'): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  try {
    // Split into lines
    const lines = content.trim().split(/\r?\n/);
    
    if (lines.length === 0) {
      result.isValid = false;
      result.errors.push('File is empty');
      return result;
    }

    // Get headers
    const headers = lines[0].split(delimiter);
    result.columnCount = headers.length;
    result.rowCount = lines.length - 1; // Exclude header row
    
    // Basic validation checks
    if (headers.length < 2) {
      result.isValid = false;
      result.errors.push(`File must have at least 2 columns`);
    }
    
    // Check for empty headers
    const emptyHeaders = headers.filter(header => header.trim() === '').length;
    if (emptyHeaders > 0) {
      result.isValid = false;
      result.errors.push(`Found ${emptyHeaders} empty column headers`);
    }
    
    // Validate data rows
    for (let i = 1; i < Math.min(lines.length, 6); i++) { // Check first 5 rows
      const row = lines[i];
      if (row.trim() === '') {
        result.isValid = false;
        result.errors.push(`Row ${i + 1} is empty`);
        continue;
      }
      
      const values = row.split(delimiter);
      if (values.length !== headers.length) {
        result.isValid = false;
        result.errors.push(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      }
    }
    
    // Create preview
    result.preview = lines.slice(0, 5);
    
    // Determine data type
    result.dataType = delimiter === '\t' ? 'TSV' : 'Delimited';
    
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to parse delimited data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Detect file type based on content or extension
 * @param content The file content
 * @param filename The filename
 * @returns The detected data type
 */
export function detectDataType(content: string, filename: string): 'CSV' | 'JSON' | 'TSV' | 'TXT' | 'Unknown' {
  // Check file extension first
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  switch (ext) {
    case 'csv':
      return 'CSV';
    case 'json':
      return 'JSON';
    case 'tsv':
      return 'TSV';
    case 'txt':
      return 'TXT';
  }
  
  // Try to detect from content
  if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
    try {
      JSON.parse(content);
      return 'JSON';
    } catch {
      // Not JSON
    }
  }
  
  // Check for CSV (comma separated)
  if (content.includes(',')) {
    return 'CSV';
  }
  
  // Check for TSV (tab separated)
  if (content.includes('\t')) {
    return 'TSV';
  }
  
  return 'Unknown';
}

/**
 * Validate dataset file based on its content and type
 * @param content The file content as string
 * @param filename The filename
 * @returns ValidationResult with validation details
 */
export function validateDataset(content: string, filename: string): ValidationResult {
  const fileType = detectDataType(content, filename);
  
  switch (fileType) {
    case 'CSV':
      return validateCSVData(content);
    case 'JSON':
      return validateJSONData(content);
    case 'TSV':
      return validateDelimitedData(content, '\t');
    case 'TXT':
      // For TXT, try to detect delimiter or treat as TSV
      if (content.includes('\t')) {
        return validateDelimitedData(content, '\t');
      } else if (content.includes(',')) {
        return validateDelimitedData(content, ',');
      } else {
        return validateDelimitedData(content, ' ');
      }
    default:
      return {
        isValid: false,
        errors: [`Unsupported file type: ${fileType}`],
      };
  }
}