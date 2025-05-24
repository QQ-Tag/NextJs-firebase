
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPrintableQrData, getQrCodeById } from '@/lib/qrService';
import type { PrintableQRInfo, StickerSize, QRCode } from '@/lib/types';
import { STICKER_SIZES } from '@/lib/types';
import { PageContainer } from '@/components/shared/PageContainer';
import { PrintOptions } from '@/components/admin/PrintOptions';
import { QrCodeSticker } from '@/components/admin/QrCodeSticker';
import PrintPageLayout from '../../PrintPageLayout';
import { Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrintSingleQrPage() {
  const params = useParams();
  const qrId = params.qrId as string;
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [printableQr, setPrintableQr] = useState<PrintableQRInfo | null>(null);
  const [selectedSize, setSelectedSize] = useState<StickerSize>('Medium');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      // Wait for auth to resolve; isLoading is initially true.
      return;
    }

    // Auth is resolved
    if (!isAdmin) {
      router.push('/admin/login?redirect=/admin/print/qr/' + qrId);
      setIsLoading(false);
      return;
    }

    // Auth is resolved, user is admin
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
            // No need to setQrCode(null) again if fetchedQr is null
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
      // Admin, but no qrId
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
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageContainer>
    );
  }
  
  if (!isAdmin) { // Should be caught by useEffect, but as safeguard
     return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </PageContainer>
    );
  }

  if (!qrCode || !printableQr) {
    return (
      <PrintPageLayout title="Error: QR Code Not Found">
        <div className="text-center py-10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl">The requested QR code (ID: {qrId || 'N/A'}) could not be found or is not printable.</p>
           <Button asChild className="mt-6">
            <Link href="/admin/dashboard">Back to Admin Dashboard</Link>
          </Button>
        </div>
      </PrintPageLayout>
    );
  }

  return (
    <PrintPageLayout title={`Print QR Code: ${printableQr.id}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 no-print">
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
        <div id="printable-area" className="md:col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center print:mt-8">
            Printing QR Code: {printableQr.id}
          </h2>
           <p className="text-sm text-muted-foreground text-center mb-6 print:mb-2">
            Selected Size: {selectedSize}
          </p>
          <div className="flex justify-center items-center p-2 border border-gray-300 rounded min-h-[200px]">
            <QrCodeSticker 
              qrId={printableQr.id} 
              uniqueId={printableQr.uniqueId} 
              size={selectedSize} 
              text={printableQr.text} 
            />
          </div>
        </div>
      </div>
    </PrintPageLayout>
  );
}
