'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPrintableQrData, getQrCodeById } from '@/lib/qrService';
import type { PrintableQRInfo, StickerSize, QRCode } from '@/lib/types';
import { STICKER_SIZES } from '@/lib/types';
import { PrintOptions } from '@/components/admin/PrintOptions';
import { QrCodeSticker } from '@/components/admin/QrCodeSticker';
import PrintPageLayout from '../../PrintPageLayout';
import { Loader2, AlertTriangle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrintSingleQrPage() {
  const params = useParams();
  const qrId = parseInt(params.qrId as string);
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [printableQr, setPrintableQr] = useState<PrintableQRInfo | null>(null);
  const [selectedSize, setSelectedSize] = useState<StickerSize>('Medium');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAdmin) {
      router.push('/admin/login?redirect=/admin/print/qr/' + qrId);
      setIsLoading(false);
      return;
    }

    if (qrId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const fetchedQr = await getQrCodeById(qrId);
          setQrCode(fetchedQr || null);
          if (fetchedQr) {
            const data = await getPrintableQrData(qrId, selectedSize);
            setPrintableQr(data);
          } else {
            setPrintableQr(null);
          }
        } catch (error) {
          console.error("Error fetching QR print data:", error);
          setQrCode(null);
          setPrintableQr(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setIsLoading(false);
      setQrCode(null);
      setPrintableQr(null);
    }
  }, [qrId, isAdmin, authLoading, router, selectedSize]);
  
  const handleSizeChange = (size: StickerSize) => {
    setSelectedSize(size);
  };

  const handlePrintAction = async () => {
    if (qrId) {
      setIsLoading(true);
      try {
        const data = await getPrintableQrData(qrId, selectedSize);
        setPrintableQr(data);
      } catch (error) {
        console.error("Error refreshing printable QR data for print:", error);
        setPrintableQr(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-0 m-0">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading QR code data...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!qrCode || !printableQr) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 m-0">
        <PrintPageLayout title="Error: QR Code Not Found">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">QR Code Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">The requested QR code (ID: {qrId || 'N/A'}) could not be found or is not printable.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>
        </PrintPageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 m-0">
      <PrintPageLayout title={`Print QR Code: ${printableQr.id}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1 no-print">
            <PrintOptions
              availableSizes={STICKER_SIZES}
              selectedSizes={[selectedSize]} 
              onSizeChange={() => {}} 
              onSingleSizeChange={handleSizeChange}
              defaultSelectedSize={selectedSize}
              onPrint={handlePrintAction}
              allowMultipleSizes={false}
            />
          </div>
          
          <div id="printable-area" className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border-0 p-6 lg:p-8">
              <div className="text-center mb-8 print:mt-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  QR Code: {printableQr.id}
                </h2>
                <p className="text-sm text-gray-500 print:mb-2">
                  Selected Size: {selectedSize}
                </p>
              </div>
              
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 min-h-[200px]">
                <QrCodeSticker 
                  qrId={printableQr.id} 
                  uniqueId={printableQr.uniqueId} 
                  size={selectedSize} 
                  text={printableQr.text} 
                />
              </div>
            </div>
          </div>
        </div>
      </PrintPageLayout>
    </div>
  );
}