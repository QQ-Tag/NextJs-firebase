// src/lib/qrService.ts
import axios from 'axios';
import { qrCodes, qrBatches, users } from './mockData';
import type { QRCode, QRBatch, User, StickerSize } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getQrCodeById = async (id: number): Promise<QRCode | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/qr-codes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return undefined;
  }
};

export const getQrCodeByUniqueId = async (uniqueId: string): Promise<QRCode | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/qr-codes/unique/${uniqueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching QR code by uniqueId:', error);
    return undefined;
  }
};

export const getOwnerByUserId = async (userId: string): Promise<User | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return undefined;
  }
};

export const claimQrCode = async (id: number, userId: string): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE_URL}/qr/qr-codes/claim`, { id, userId });
    return true;
  } catch (error) {
    console.error('Error claiming QR code:', error);
    return false;
  }
};

export const getUserLinkedQrCodes = async (userId: string): Promise<QRCode[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/users/${userId}/qr-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user QR codes:', error);
    return [];
  }
};

export const unlinkQrCode = async (id: number, userId: string): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE_URL}/qr/qr-codes/unlink`, { id, userId });
    return true;
  } catch (error) {
    console.error('Error unlinking QR code:', error);
    return false;
  }
};

export const deleteQrCode = async (id: number, userId: string): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE_URL}/qr/qr-codes/delete`, { id, userId });
    return true;
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return false;
  }
};

export const getAllQrCodes = async (): Promise<QRCode[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/qr-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all QR codes:', error);
    return [];
  }
};

export const getAllBatches = async (): Promise<QRBatch[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/batches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
};

export const getBatchById = async (batchId: number): Promise<QRBatch | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/batches/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch:', error);
    return undefined;
  }
};

export const generateQrBatch = async (batchName: string, quantity: number): Promise<QRBatch | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/qr/batches/generate`, { batchName, quantity });
    return response.data;
  } catch (error) {
    console.error('Error generating batch:', error);
    return null;
  }
};

export const getQrCodesByBatchId = async (batchId: number): Promise<QRCode[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qr/batches/${batchId}/qr-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching QR codes by batch:', error);
    return [];
  }
};

export interface PrintableQRInfo {
  id: number;
  uniqueId: string;
  url: string;
  size: StickerSize;
  text: string;
}

export const getPrintableBatchData = async (batchId: number, sizes: StickerSize[]): Promise<PrintableQRInfo[]> => {
  try {
    const qrCodes = await getQrCodesByBatchId(batchId);
    return qrCodes.map((qr, index) => ({
      id: qr.id,
      uniqueId: qr.uniqueId,
      url: qr.url,
      size: sizes[index % sizes.length],
      text: 'Scan to Return',
    }));
  } catch (error) {
    console.error('Error fetching printable batch data:', error);
    return [];
  }
};

export const getPrintableQrData = async (id: number, size: StickerSize): Promise<PrintableQRInfo | null> => {
  try {
    const qr = await getQrCodeById(id);
    if (!qr) return null;
    return {
      id: qr.id,
      uniqueId: qr.uniqueId,
      url: qr.url,
      size,
      text: 'Scan to Return',
    };
  } catch (error) {
    console.error('Error fetching printable QR data:', error);
    return null;
  }
};