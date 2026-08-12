/**
 * Secure File Upload Validator
 * Client-side validation for file uploads
 * 
 * ⚠️ IMPORTANT: Always validate on server-side as well!
 * Client-side validation can be bypassed
 */

export interface FileValidationConfig {
  maxSize?: number;                    // Max file size in bytes
  allowedTypes?: string[];             // MIME types: 'image/png', 'application/pdf'
  allowedExtensions?: string[];        // File extensions: '.jpg', '.pdf'
  allowedNames?: RegExp;               // Pattern for filenames
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Default allowed file types
 */
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

const DEFAULT_ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp'
];

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File | null,
  config: FileValidationConfig = {}
): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  const maxSize = config.maxSize ?? DEFAULT_MAX_SIZE;
  const allowedTypes = config.allowedTypes ?? DEFAULT_ALLOWED_TYPES;
  const allowedExtensions = config.allowedExtensions ?? DEFAULT_ALLOWED_EXTENSIONS;

  // Normalize extensions (add dot if missing)
  const normalizedExtensions = allowedExtensions.map(ext => 
    ext.startsWith('.') ? ext : `.${ext}`
  );

  // 1. Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds limit (${formatFileSize(maxSize)})`
    };
  }

  // 2. Check file type (MIME)
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // 3. Check file extension
  const fileExtension = getFileExtension(file.name);
  if (!normalizedExtensions.includes(fileExtension.toLowerCase())) {
    return {
      isValid: false,
      error: `File extension not allowed. Allowed: ${normalizedExtensions.join(', ')}`
    };
  }

  // 4. Check filename pattern
  if (config.allowedNames && !config.allowedNames.test(file.name)) {
    return {
      isValid: false,
      error: 'Invalid filename format'
    };
  }

  // 5. Warnings
  const warnings: string[] = [];

  // Warn about double extensions (potential security risk)
  if (hasDoubleExtension(file.name)) {
    warnings.push('Unusual filename detected. Ensure this is the file you intended.');
  }

  // Warn if filename contains special characters
  if (hasSpecialCharacters(file.name)) {
    warnings.push('Filename contains special characters. It may be renamed on server.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate multiple files
 */
export function validateFileList(
  files: FileList | null,
  config: FileValidationConfig = {},
  maxFiles: number = 5
): ValidationResult {
  if (!files || files.length === 0) {
    return { isValid: false, error: 'No files provided' };
  }

  if (files.length > maxFiles) {
    return {
      isValid: false,
      error: `Too many files (max ${maxFiles})`
    };
  }

  // Validate each file
  let totalSize = 0;
  for (let i = 0; i < files.length; i++) {
    const result = validateFileUpload(files[i], config);
    
    if (!result.isValid) {
      return {
        isValid: false,
        error: `File ${i + 1}: ${result.error}`
      };
    }

    totalSize += files[i].size;
  }

  // Check total size
  const maxTotalSize = (config.maxSize ?? DEFAULT_MAX_SIZE) * maxFiles;
  if (totalSize > maxTotalSize) {
    return {
      isValid: false,
      error: `Total file size exceeds limit (${formatFileSize(maxTotalSize)})`
    };
  }

  return { isValid: true };
}

/**
 * Generate safe filename from user input
 * Prevents directory traversal and other filename-based attacks
 */
export function generateSafeFilename(
  originalFilename: string,
  prefix?: string
): string {
  // Get file extension
  const ext = getFileExtension(originalFilename);
  
  // Generate random filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const name = `${prefix || 'file'}_${timestamp}_${random}`;
  
  return `${name}${ext}`;
}

/**
 * Helper: Get file extension
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Helper: Check for double extensions (e.g., file.php.jpg)
 */
function hasDoubleExtension(filename: string): boolean {
  const parts = filename.split('.');
  return parts.length > 2;
}

/**
 * Helper: Check for suspicious special characters
 */
function hasSpecialCharacters(filename: string): boolean {
  const dangerousChars = /[<>:"\\/|?*]/;
  return dangerousChars.test(filename);
}

/**
 * Helper: Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Create a preview URL for files
 */
export function createFilePreview(file: File): string | null {
  // Only create preview for images and PDFs
  if (!file.type.startsWith('image/')) {
    return null;
  }

  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Failed to create file preview:', error);
    return null;
  }
}

/**
 * Clean up preview URLs to prevent memory leaks
 */
export function revokeFilePreview(objectUrl: string): void {
  try {
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Failed to revoke file preview:', error);
  }
}

/**
 * Simulate file upload with progress tracking
 * For demonstration purposes
 */
export async function simulateFileUpload(
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  const chunkSize = 64 * 1024; // 64KB chunks
  const chunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunks; i++) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const progress = Math.min(100, ((i + 1) / chunks) * 100);
    onProgress?.(Math.round(progress));
  }
}

/**
 * Common file validation presets
 */
export const ValidationPresets = {
  // Images only
  IMAGES: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxSize: 5 * 1024 * 1024
  },

  // Documents
  DOCUMENTS: {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.pdf', '.doc', '.docx'],
    maxSize: 10 * 1024 * 1024
  },

  // Video
  VIDEO: {
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    allowedExtensions: ['.mp4', '.webm', '.ogv'],
    maxSize: 100 * 1024 * 1024
  },

  // Audio
  AUDIO: {
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    allowedExtensions: ['.mp3', '.wav', '.ogg'],
    maxSize: 20 * 1024 * 1024
  },

  // CSV/Excel
  SPREADSHEET: {
    allowedTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    allowedExtensions: ['.csv', '.xls', '.xlsx'],
    maxSize: 10 * 1024 * 1024
  }
};
