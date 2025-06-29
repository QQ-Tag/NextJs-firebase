'use client';

import type { QRBatch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, Package, CalendarDays, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface BatchListProps {
  batches: QRBatch[];
}

export function BatchList({ batches }: BatchListProps) {
  if (batches.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">No Batches Found</CardTitle>
          <CardDescription className="text-gray-600">
            Generate your first batch to get started with QR code management.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              QR Batches
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage all generated QR code batches
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Mobile view */}
        <div className="block sm:hidden">
          {batches.map((batch) => (
            <div key={batch.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{batch.batchName}</h3>
                    <p className="text-sm text-gray-600 font-mono">{batch.startId} - {batch.endId}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    {batch.quantity} QRs
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(batch.createdAt), 'MMM dd, yyyy')}
                </div>
                
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/admin/print/batch/${batch.id}`} className="flex items-center justify-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print Batch
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-700">Batch Name</TableHead>
                <TableHead className="font-semibold text-gray-700">ID Range</TableHead>
                <TableHead className="font-semibold text-gray-700">Quantity</TableHead>
                <TableHead className="font-semibold text-gray-700">Created At</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{batch.batchName}</TableCell>
                  <TableCell className="font-mono text-gray-600">{batch.startId} - {batch.endId}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {batch.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      {format(new Date(batch.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Link href={`/admin/print/batch/${batch.id}`} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" />
                        Print Batch
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}