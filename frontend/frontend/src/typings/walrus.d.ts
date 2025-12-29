export interface WalrusBlob {
  id: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface WalrusUploadResult {
  cid: string;
  size: number;
}

export interface WalrusDownloadResult {
  data: any;
  mimeType: string;
  size: number;
}

export interface WalrusPinResult {
  blobId: string;
  pinned: boolean;
  expiration?: Date;
}

export class WalrusError extends Error {
  statusCode?: number;
  originalError?: any;
  
  constructor(message: string, statusCode?: number, originalError?: any);
}