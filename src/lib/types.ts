export interface User {
  id: string;
  email: string;
  password?: string; // Password won't be stored in frontend state after login
  name: string;
  phone?: string;
  whatsapp?: string;
  linkedQrCodes: string[]; // Array of QR code IDs
}

export interface QRCode {
  id: string; // e.g., QR000001
  uniqueId: string; // The <unique_id> part of the URL, could be same as id or a separate hash
  status: 'unclaimed' | 'claimed' | 'deleted';
  userId?: string; // ID of the user who claimed it
  batchId: string;
  createdAt: Date;
}

export interface QRBatch {
  id: string; // auto-generated or batch name
  name: string; // e.g., "Batch_Jan2025"
  startId: string; // e.g., QR000001
  endId: string; // e.g., QR000500
  quantity: number;
  createdAt: Date;
}

export type StickerSize = 'Extra Small' | 'Small' | 'Medium' | 'Large' | 'Extra Large';

export const STICKER_SIZES: StickerSize[] = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];

// For simpler frontend auth state
export interface AuthUser extends Omit<User, 'password' | 'linkedQrCodes'> {
  // Any additional frontend-specific fields if needed
}
