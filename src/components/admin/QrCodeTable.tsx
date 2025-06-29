'use client';

import { useEffect, useState } from 'react';
import type { QRCode, User, QRBatch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, Loader2, Search, Filter, QrCodeIcon, User as UserIcon, Package } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

interface QrCodeWithDetails extends QRCode {
  ownerEmail?: string;
  batchName?: string;
}

export function QrCodeTable({ initialQrs, initialBatches, initialUsers }: { initialQrs: QRCode[], initialBatches: QRBatch[], initialUsers: User[] }) {
  const [qrs, setQrs] = useState<QrCodeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState<number | 'all'>('all');

  const [allBatches, setAllBatches] = useState<QRBatch[]>(initialBatches);
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    const map = new Map<string, User>();
    initialUsers.forEach(user => map.set(user.id, user));
    setUsersMap(map);
  }, [initialUsers]);

  useEffect(() => {
    const processQrs = async () => {
      setIsLoading(true);
      const detailedQrs = await Promise.all(initialQrs.map(async (qr) => {
        let ownerEmail: string | undefined;
        if (qr.userId) {
          const owner = usersMap.get(qr.userId);
          ownerEmail = owner?.email;
        }
        const batch = allBatches.find(b => b.id === qr.batchId);
        return { ...qr, ownerEmail, batchName: batch?.batchName };
      }));
      setQrs(detailedQrs);
      setIsLoading(false);
    };
    processQrs();
  }, [initialQrs, allBatches, usersMap]);

  const filteredQrs = qrs.filter(qr => {
    const searchMatch =
      qr.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qr.ownerEmail && qr.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (qr.batchName && qr.batchName.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = statusFilter === 'all' || qr.status === statusFilter;
    const batchMatch = batchFilter === 'all' || qr.batchId === batchFilter;
    return searchMatch && statusMatch && batchMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading QR codes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <QrCodeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              All QR Codes
            </CardTitle>
            <CardDescription className="text-gray-600">
              View and manage all generated QR codes in the system
            </CardDescription>
          </div>
        </div>
        
        {/* Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search QR ID, User Email, Batch..."
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Unclaimed">Unclaimed</SelectItem>
                <SelectItem value="Claimed">Claimed</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={batchFilter.toString()} onValueChange={(value) => setBatchFilter(value === 'all' ? 'all' : parseInt(value))}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80">
                <SelectValue placeholder="Filter by Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {allBatches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>{batch.batchName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredQrs.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-900 mb-2">No QR Codes Found</p>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="block sm:hidden">
              {filteredQrs.map((qr) => (
                <div key={qr.id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 font-mono">QR {qr.id}</h3>
                        <p className="text-sm text-gray-600">{qr.batchName || qr.batchId}</p>
                      </div>
                      <Badge 
                        variant={
                          qr.status === 'Claimed' ? 'default' : 
                          qr.status === 'Unclaimed' ? 'secondary' : 
                          'destructive'
                        }
                        className="text-xs"
                      >
                        {qr.status}
                      </Badge>
                    </div>
                    
                    {qr.ownerEmail && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UserIcon className="h-4 w-4" />
                        {qr.ownerEmail}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      {format(new Date(qr.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                    
                    {qr.status !== 'Deleted' && (
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/admin/print/qr/${qr.id}`} className="flex items-center justify-center gap-2">
                          <Printer className="h-4 w-4" />
                          Print
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700">QR ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">User</TableHead>
                    <TableHead className="font-semibold text-gray-700">Batch</TableHead>
                    <TableHead className="font-semibold text-gray-700">Created At</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQrs.map((qr) => (
                    <TableRow key={qr.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-mono font-medium text-gray-900">{qr.id}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            qr.status === 'Claimed' ? 'default' : 
                            qr.status === 'Unclaimed' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {qr.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{qr.ownerEmail || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">{qr.batchName || qr.batchId}</TableCell>
                      <TableCell className="text-gray-600">{format(new Date(qr.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        {qr.status !== 'Deleted' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild 
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                          >
                            <Link href={`/admin/print/qr/${qr.id}`} className="flex items-center gap-2">
                              <Printer className="h-4 w-4" />
                              Print
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}