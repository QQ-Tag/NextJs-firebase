//src/app/admin/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { BatchGeneratorForm } from '@/components/admin/BatchGeneratorForm';
import { QrCodeTable } from '@/components/admin/QrCodeTable';
import { BatchList } from '@/components/admin/BatchList';
import { getAllBatches, getAllQrCodes, getOwnerByUserId } from '@/lib/qrService'; // Assuming getOwnerByUserId is not needed here directly but for QrCodeTable it is passed.
import type { QRBatch, QRCode, User } from '@/lib/types';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users as mockUsers } from '@/lib/mockData'; // Import mock users directly for passing to QrCodeTable


export default function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [batches, setBatches] = useState<QRBatch[]>([]);
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers); // Pass initial mock users
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [fetchedBatches, fetchedQrs] = await Promise.all([
        getAllBatches(),
        getAllQrCodes(),
        // Users are already loaded from mockData
      ]);
      setBatches(fetchedBatches);
      setQrs(fetchedQrs);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      // Handle error (e.g., show toast)
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        router.push('/admin/login?redirect=/admin/dashboard');
      } else {
        fetchData();
      }
    }
  }, [isAdmin, authLoading, router, fetchData]);

  if (authLoading || dataLoading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageContainer>
    );
  }

  if (!isAdmin) {
    // This will be brief as the redirect should occur
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page. Redirecting to login...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage QR codes, batches, and system settings.</p>
      </section>

      <Tabs defaultValue="manage_qrs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage_qrs">Manage QR Codes</TabsTrigger>
          <TabsTrigger value="manage_batches">Manage Batches</TabsTrigger>
          <TabsTrigger value="generate_batch">Generate Batch</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage_qrs" className="mt-6">
            <QrCodeTable initialQrs={qrs} initialBatches={batches} initialUsers={users} />
        </TabsContent>
        
        <TabsContent value="manage_batches" className="mt-6">
          <BatchList batches={batches} />
        </TabsContent>

        <TabsContent value="generate_batch" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <BatchGeneratorForm onBatchCreated={fetchData} />
          </div>
        </TabsContent>
      </Tabs>

    </PageContainer>
  );
}
