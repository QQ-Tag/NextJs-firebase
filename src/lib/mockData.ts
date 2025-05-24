import type { User, QRCode, QRBatch } from './types';

export let users: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed and not stored client-side
    name: 'John Doe',
    phone: '123-456-7890',
    whatsapp: '1234567890',
    linkedQrCodes: ['QR000001'],
  },
  {
    id: 'user2',
    email: 'jane@example.com',
    password: 'password456',
    name: 'Jane Smith',
    phone: '987-654-3210',
    linkedQrCodes: ['QR000003'],
  },
];

export let qrCodes: QRCode[] = [
  {
    id: 'QR000001',
    uniqueId: 'uid001',
    status: 'claimed',
    userId: 'user1',
    batchId: 'batch1',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'QR000002',
    uniqueId: 'uid002',
    status: 'unclaimed',
    batchId: 'batch1',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'QR000003',
    uniqueId: 'uid003',
    status: 'claimed',
    userId: 'user2',
    batchId: 'batch1',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'QR000004',
    uniqueId: 'uid004',
    status: 'deleted',
    batchId: 'batch1',
    createdAt: new Date('2024-01-01T10:00:00Z'),
  },
];

export let qrBatches: QRBatch[] = [
  {
    id: 'batch1',
    name: 'Initial Batch',
    startId: 'QR000001',
    endId: 'QR000004', // Assuming 4 QRs in this mock batch
    quantity: 4,
    createdAt: new Date('2024-01-01T09:00:00Z'),
  },
];

// Admin credentials (hardcoded)
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword',
};
