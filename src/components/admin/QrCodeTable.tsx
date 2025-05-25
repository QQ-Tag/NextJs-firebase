// src/components/admin/QrCodeTable.tsx
'use client';

import { useEffect, useState } from 'react';
import type { QRCode, User, QRBatch } from '@/lib/types';
import { getAllQrCodes, getOwnerByUserId, getBatchById } from '@/lib/qrService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, Loader2, Search, Filter, QrCodeIcon } from 'lucide-react';
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
      qr.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || // Convert number to string
      qr.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qr.ownerEmail && qr.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (qr.batchName && qr.batchName.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = statusFilter === 'all' || qr.status === statusFilter;
    const batchMatch = batchFilter === 'all' || qr.batchId === batchFilter;
    return searchMatch && statusMatch && batchMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><QrCodeIcon />All QR Codes</CardTitle>
        <CardDescription>View and manage all generated QR codes in the system.</CardDescription>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search QR ID, User Email, Batch..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[200px]">
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
      </CardHeader>
      <CardContent>
        {filteredQrs.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No QR Codes Found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>QR ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQrs.map((qr) => (
              <TableRow key={qr.id}>
                <TableCell className="font-mono">{qr.id}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      qr.status === 'Claimed' ? 'default' : 
                      qr.status === 'Unclaimed' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{qr.ownerEmail || 'N/A'}</TableCell>
                <TableCell>{qr.batchName || qr.batchId}</TableCell>
                <TableCell>{format(new Date(qr.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell className="text-right">
                  {qr.status !== 'Deleted' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/print/qr/${qr.id}`}>
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
