
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPrintableBatchData, getBatchById } from '@/lib/qrService';
import type { PrintableQRInfo, StickerSize, QRBatch } from '@/lib/types';
import { STICKER_SIZES } from '@/lib/types';
import { PageContainer } from '@/components/shared/PageContainer';
import { PrintOptions } from '@/components/admin/PrintOptions';
import { QrCodeSticker } from '@/components/admin/QrCodeSticker';
import PrintPageLayout from '../../PrintPageLayout';
import { Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrintBatchPage() {
  const params = useParams();
  const batchId = params.batchId as string;
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [batch, setBatch] = useState<QRBatch | null>(null);
  const [printableQrs, setPrintableQrs] = useState<PrintableQRInfo[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<StickerSize[]>(['Medium']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      // Wait for auth to resolve; isLoading is initially true, so loader will show.
      return;
    }

    // Auth is resolved (authLoading is false)
    if (!isAdmin) {
      router.push('/admin/login?redirect=/admin/print/batch/' + batchId);
      setIsLoading(false); // Set loading false as we are redirecting
      return;
    }

    // Auth is resolved, user is admin
    if (batchId) {
      const fetchData = async () => {
        setIsLoading(true); // Set loading true for this specific fetch operation
        try {
          const fetchedBatch = await getBatchById(batchId);
          setBatch(fetchedBatch || null);
          if (fetchedBatch && selectedSizes.length > 0) {
            const data = await getPrintableBatchData(batchId, selectedSizes);
            setPrintableQrs(data);
          } else { 
            setPrintableQrs([]);
            if (!fetchedBatch) setBatch(null);
          }
        } catch (error) {
          console.error("Error fetching batch print data:", error);
          setBatch(null); 
          setPrintableQrs([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      // Admin, but no batchId (e.g., invalid URL or params not ready)
      setIsLoading(false); // Ensure loading is false so it can proceed to !batch check
      setBatch(null);
      setPrintableQrs([]);
    }
  }, [batchId, isAdmin, authLoading, router, selectedSizes]);

  const handleSizeChange = (size: StickerSize, checked: boolean) => {
    setSelectedSizes(prev => {
      const newSizes = checked ? [...prev, size] : prev.filter(s => s !== size);
      return newSizes.length > 0 ? newSizes : ['Medium'];
    });
  };
  
  const handlePrintAction = async () => {
    if (batchId && selectedSizes.length > 0) {
      setIsLoading(true);
      try {
        const data = await getPrintableBatchData(batchId, selectedSizes);
        setPrintableQrs(data);
      } catch (error) {
        console.error("Error refreshing printable batch data for print:", error);
        setPrintableQrs([]);
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

  if (!isAdmin) { // Should be caught by useEffect redirect, but as a safeguard
     return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </PageContainer>
    );
  }

  if (!batch) {
    return (
      <PrintPageLayout title="Error: Batch Not Found">
        <div className="text-center py-10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl">The requested batch (ID: {batchId || 'N/A'}) could not be found.</p>
          <Button asChild className="mt-6">
            <Link href="/admin/dashboard">Back to Admin Dashboard</Link>
          </Button>
        </div>
      </PrintPageLayout>
    );
  }
  
  return (
    <PrintPageLayout title={`Print Batch: ${batch.name}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 no-print">
          <PrintOptions
            availableSizes={STICKER_SIZES}
            selectedSizes={selectedSizes}
            onSizeChange={handleSizeChange}
            onPrint={handlePrintAction}
            allowMultipleSizes={true}
          />
        </div>
        <div id="printable-area" className="md:col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center print:mt-8">
            Printing QR Codes for Batch: {batch.name} (IDs: {batch.startId} - {batch.endId})
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6 print:mb-2">
            Selected Sizes: {selectedSizes.join(', ')}
          </p>
          {printableQrs.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center p-2 border border-gray-300 rounded">
              {printableQrs.map((qr) => (
                <QrCodeSticker key={qr.id} qrId={qr.id} uniqueId={qr.uniqueId} size={qr.size} text={qr.text} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
                {selectedSizes.length === 0 ? "Please select at least one sticker size." : "No QR codes to display for this batch with selected sizes."}
            </p>
          )}
        </div>
      </div>
    </PrintPageLayout>
  );
}
