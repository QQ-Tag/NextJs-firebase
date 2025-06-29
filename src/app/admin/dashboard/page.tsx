'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { BatchGeneratorForm } from '@/components/admin/BatchGeneratorForm';
import { QrCodeTable } from '@/components/admin/QrCodeTable';
import { BatchList } from '@/components/admin/BatchList';
import { getAllBatches, getAllQrCodes } from '@/lib/qrService';
import type { QRBatch, QRCode, User } from '@/lib/types';
import { Loader2, ShieldAlert, BarChart3, QrCode, Package, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { users as mockUsers } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [batches, setBatches] = useState<QRBatch[]>([]);
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [fetchedBatches, fetchedQrs] = await Promise.all([
        getAllBatches(),
        getAllQrCodes(),
      ]);
      setBatches(fetchedBatches);
      setQrs(fetchedQrs);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="pt-8">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalQrs = qrs.length;
  const claimedQrs = qrs.filter(qr => qr.status === 'Claimed').length;
  const unclaimedQrs = qrs.filter(qr => qr.status === 'Unclaimed').length;
  const totalBatches = batches.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PageContainer className="py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage QR codes, batches, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total QR Codes</p>
                  <p className="text-2xl sm:text-3xl font-bold">{totalQrs}</p>
                </div>
                <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Claimed</p>
                  <p className="text-2xl sm:text-3xl font-bold">{claimedQrs}</p>
                </div>
                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Unclaimed</p>
                  <p className="text-2xl sm:text-3xl font-bold">{unclaimedQrs}</p>
                </div>
                <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Batches</p>
                  <p className="text-2xl sm:text-3xl font-bold">{totalBatches}</p>
                </div>
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="manage_qrs" className="w-full">
            <div className="border-b border-gray-200 px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50/50 rounded-xl p-1 h-auto">
                <TabsTrigger 
                  value="manage_qrs" 
                  className="flex items-center gap-2 py-3 px-2 sm:px-4 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <QrCode className="h-4 w-4" />
                  <span className="hidden sm:inline">Manage QR Codes</span>
                  <span className="sm:hidden">QR Codes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="manage_batches" 
                  className="flex items-center gap-2 py-3 px-2 sm:px-4 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Manage Batches</span>
                  <span className="sm:hidden">Batches</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="generate_batch" 
                  className="flex items-center gap-2 py-3 px-2 sm:px-4 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate Batch</span>
                  <span className="sm:hidden">Generate</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="manage_qrs" className="mt-0 p-4 sm:p-6">
              <QrCodeTable initialQrs={qrs} initialBatches={batches} initialUsers={users} />
            </TabsContent>
            
            <TabsContent value="manage_batches" className="mt-0 p-4 sm:p-6">
              <BatchList batches={batches} />
            </TabsContent>

            <TabsContent value="generate_batch" className="mt-0 p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                <BatchGeneratorForm onBatchCreated={fetchData} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </PageContainer>
    </div>
  );
}