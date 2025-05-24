import { qrCodes, qrBatches, users } from './mockData';
import type { QRCode, QRBatch, User, StickerSize } from './types';

// Helper to generate sequential QR IDs
let lastQrIdCounter = qrCodes.length > 0 ? parseInt(qrCodes[qrCodes.length - 1].id.substring(2), 10) : 0;

function generateQrId(): string {
  lastQrIdCounter++;
  return `QR${lastQrIdCounter.toString().padStart(6, '0')}`;
}

function generateUniqueId(): string {
  return `uid${Math.random().toString(36).substring(2, 10)}`;
}

export const getQrCodeByUniqueId = async (uniqueId: string): Promise<QRCode | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
  return qrCodes.find(qr => qr.uniqueId === uniqueId && qr.status !== 'deleted');
};

export const getQrCodeById = async (id: string): Promise<QRCode | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return qrCodes.find(qr => qr.id === id && qr.status !== 'deleted');
};


export const getOwnerByUserId = async (userId: string): Promise<User | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return users.find(u => u.id === userId);
};

export const claimQrCode = async (qrUniqueId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const qrIndex = qrCodes.findIndex(qr => qr.uniqueId === qrUniqueId);
  if (qrIndex !== -1 && qrCodes[qrIndex].status === 'unclaimed') {
    qrCodes[qrIndex].status = 'claimed';
    qrCodes[qrIndex].userId = userId;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (!users[userIndex].linkedQrCodes.includes(qrCodes[qrIndex].id)) {
         users[userIndex].linkedQrCodes.push(qrCodes[qrIndex].id);
      }
    }
    return true;
  }
  return false;
};

export const getUserLinkedQrCodes = async (userId: string): Promise<QRCode[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const user = users.find(u => u.id === userId);
  if (!user) return [];
  return qrCodes.filter(qr => user.linkedQrCodes.includes(qr.id) && qr.status !== 'deleted');
};

export const unlinkQrCode = async (qrId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const qrIndex = qrCodes.findIndex(qr => qr.id === qrId && qr.userId === userId);
  if (qrIndex !== -1) {
    qrCodes[qrIndex].status = 'unclaimed';
    delete qrCodes[qrIndex].userId;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].linkedQrCodes = users[userIndex].linkedQrCodes.filter(id => id !== qrId);
    }
    return true;
  }
  return false;
};

export const deleteQrCode = async (qrId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const qrIndex = qrCodes.findIndex(qr => qr.id === qrId && qr.userId === userId);
  // Admin should be able to delete any QR, user only their own. This mock allows user to delete.
  if (qrIndex !== -1) {
    qrCodes[qrIndex].status = 'deleted';
    // Optionally remove from user's linkedQrCodes if not already handled by status check
    const userIndex = users.findIndex(u => u.id === userId);
     if (userIndex !== -1) {
      users[userIndex].linkedQrCodes = users[userIndex].linkedQrCodes.filter(id => id !== qrId);
    }
    return true;
  }
  return false;
};

// Admin functions
export const getAllQrCodes = async (): Promise<QRCode[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...qrCodes]; // Return a copy
};

export const getAllBatches = async (): Promise<QRBatch[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...qrBatches];
};

export const getBatchById = async (batchId: string): Promise<QRBatch | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return qrBatches.find(b => b.id === batchId);
}

export const generateQrBatch = async (batchName: string, quantity: number): Promise<QRBatch | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (quantity <= 0) return null;

  const newBatchId = `batch${qrBatches.length + 1}`;
  const newQRCodes: QRCode[] = [];
  const firstId = generateQrId(); // Generate first ID before loop to set startId

  const firstNewQR: QRCode = {
    id: firstId,
    uniqueId: generateUniqueId(),
    status: 'unclaimed',
    batchId: newBatchId,
    createdAt: new Date(),
  };
  newQRCodes.push(firstNewQR);
  
  for (let i = 1; i < quantity; i++) {
    const qrId = generateQrId();
    newQRCodes.push({
      id: qrId,
      uniqueId: generateUniqueId(),
      status: 'unclaimed',
      batchId: newBatchId,
      createdAt: new Date(),
    });
  }

  qrCodes.push(...newQRCodes);

  const newBatch: QRBatch = {
    id: newBatchId,
    name: batchName,
    startId: newQRCodes[0].id,
    endId: newQRCodes[newQRCodes.length - 1].id,
    quantity,
    createdAt: new Date(),
  };
  qrBatches.push(newBatch);
  return newBatch;
};


export const getQrCodesByBatchId = async (batchId: string): Promise<QRCode[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return qrCodes.filter(qr => qr.batchId === batchId && qr.status !== 'deleted');
};

// Mock PDF generation info
export interface PrintableQRInfo {
  id: string;
  uniqueId: string;
  size: StickerSize;
  text: string; // "Scan to Return"
}

export const getPrintableBatchData = async (batchId: string, sizes: StickerSize[]): Promise<PrintableQRInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const batchQRs = qrCodes.filter(qr => qr.batchId === batchId && qr.status !== 'deleted');
  // For simplicity, let's assign sizes cyclically if multiple sizes are chosen for a batch.
  // A real app might have more complex logic for distributing sizes.
  return batchQRs.map((qr, index) => ({
    id: qr.id,
    uniqueId: qr.uniqueId,
    size: sizes[index % sizes.length], // Cycle through selected sizes
    text: "Scan to Return",
  }));
};

export const getPrintableQrData = async (qrId: string, size: StickerSize): Promise<PrintableQRInfo | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const qr = qrCodes.find(q => q.id === qrId && q.status !== 'deleted');
  if (!qr) return null;
  return {
    id: qr.id,
    uniqueId: qr.uniqueId,
    size: size,
    text: "Scan to Return",
  };
};
