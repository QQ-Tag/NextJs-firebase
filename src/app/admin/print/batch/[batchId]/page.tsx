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
import { Loader2, AlertTriangle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrintBatchPage() {
  const params = useParams();
  const batchId = parseInt(params.batchId as string);
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [batch, setBatch] = useState<QRBatch | null>(null);
  const [printableQrs, setPrintableQrs] = useState<PrintableQRInfo[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<StickerSize[]>(['Medium']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAdmin) {
      router.push('/admin/login?redirect=/admin/print/batch/' + batchId);
      setIsLoading(false);
      return;
    }

    if (batchId) {
      const fetchData = async () => {
        setIsLoading(true);
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
      setIsLoading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading batch data...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <PrintPageLayout title="Error: Batch Not Found">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Batch Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">The requested batch (ID: {batchId || 'N/A'}) could not be found.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>
        </PrintPageLayout>
      );
    }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PrintPageLayout title={`Print Batch: ${batch.batchName}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1 no-print">
            <PrintOptions
              availableSizes={STICKER_SIZES}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              onPrint={handlePrintAction}
              allowMultipleSizes={true}
            />
          </div>
          
          <div id="printable-area" className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border-0 p-6 lg:p-8">
              <div className="text-center mb-8 print:mt-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  QR Codes for Batch: {batch.batchName}
                </h2>
                <p className="text-gray-600 mb-2">
                  ID Range: {batch.startId} - {batch.endId}
                </p>
                <p className="text-sm text-gray-500 print:mb-2">
                  Selected Sizes: {selectedSizes.join(', ')}
                </p>
              </div>
              
              {printableQrs.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  {printableQrs.map((qr) => (
                    <QrCodeSticker 
                      key={qr.id} 
                      qrId={qr.id} 
                      uniqueId={qr.uniqueId} 
                      size={qr.size} 
                      text={qr.text} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    {selectedSizes.length === 0 ? "Please select at least one sticker size." : "No QR codes to display for this batch with selected sizes."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PrintPageLayout>
    </div>
  );
}