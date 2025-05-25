export interface User {
  id: string;
  email: string;
  password?: string; // Password won't be stored in frontend state after login
  name: string;
  phone?: string;
  whatsapp?: string;
  linkedQrCodes: number[]; // Array of QR code IDs
}

export interface QRCode {
  id: number;
  uniqueId: string; // e.g., "QR000001"
  batchId: number;
  userId?: string;
  status: 'Unclaimed' | 'Claimed' | 'Deleted';
  url: string;
  createdAt: string;
}

export interface QRBatch {
  id: number; 
  batchName: string; // e.g., "Batch_Jan2025"
  startId: string; // e.g., QR000001
  endId: string; // e.g., QR000500
  quantity: number;
  createdAt: Date;
}

export type StickerSize = 'Extra Small' | 'Small' | 'Medium' | 'Large' | 'Extra Large';

export const STICKER_SIZES: StickerSize[] = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];

export interface PrintableQRInfo {
  id: number;
  uniqueId: string;
  url: string;
  size: StickerSize;
  text: string;
}

// For simpler frontend auth state
export interface AuthUser extends Omit<User, 'password' | 'linkedQrCodes'> {
  // Any additional frontend-specific fields if needed
}
