'use client';

import type { QRBatch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Package, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface BatchListProps {
  batches: QRBatch[];
}

export function BatchList({ batches }: BatchListProps) {
  if (batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package />QR Batches</CardTitle>
          <CardDescription>Manage all generated QR code batches.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p>No batches found. Generate a new batch to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Package />QR Batches</CardTitle>
        <CardDescription>Manage all generated QR code batches.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>ID Range</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.name}</TableCell>
                <TableCell className="font-mono">{batch.startId} - {batch.endId}</TableCell>
                <TableCell>{batch.quantity}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4"/>
                        {format(new Date(batch.createdAt), 'MMM dd, yyyy')}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/print/batch/${batch.id}`}>
                      <Printer className="h-4 w-4 mr-1" /> Print Batch
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
