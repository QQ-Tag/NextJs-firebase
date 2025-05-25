import type { User, QRCode, QRBatch } from './types';

export let users: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed and not stored client-side
    name: 'John Doe',
    phone: '123-456-7890',
    whatsapp: '1234567890',
    linkedQrCodes: [1],
  },
  {
    id: 'user2',
    email: 'jane@example.com',
    password: 'password456',
    name: 'Jane Smith',
    phone: '987-654-3210',
    linkedQrCodes: [2, 3],
  },
];

export let qrCodes: QRCode[] = [
  {
    id: 1,
    uniqueId: 'QR000001',
    status: 'claimed',
    userId: 'user1',
    batchId: 2,
    url: 'https://example.com/qr/QR000001',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    uniqueId: 'QR000002',
    status: 'unclaimed',
    batchId: 22,
    url: 'https://example.com/qr/QR000002',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 3,
    uniqueId: 'QR000003',
    status: 'claimed',
    userId: 'user2',
    batchId: 2,
    url: 'https://example.com/qr/QR000003',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 4,
    uniqueId: 'QR000004',
    status: 'deleted',
    batchId: 2,
    url: 'https://example.com/qr/QR000004',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export let qrBatches: QRBatch[] = [
  {
    id: 1,
    batchName: 'Initial Batch',
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
