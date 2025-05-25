// src/components/qr/UserQrList.tsx
'use client';

import { useEffect, useState } from 'react';
import type { QRCode } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUserLinkedQrCodes, unlinkQrCode, deleteQrCode } from '@/lib/qrService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Link2Off, Loader2, Info, QrCode } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

export function UserQrList() {
  const { currentUser, loading: authLoading } = useAuth();
  const [linkedQrs, setLinkedQrs] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}); // For unlink/delete loading state
  const { toast } = useToast();

  const fetchQrs = async () => {
    if (currentUser) {
      setIsLoading(true);
      const qrs = await getUserLinkedQrCodes(currentUser.id);
      setLinkedQrs(qrs.filter(qr => qr.status === 'Claimed')); // Only show currently claimed QRs
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchQrs();
    } else if (!authLoading && !currentUser) {
      setIsLoading(false);
      setLinkedQrs([]);
    }
  }, [currentUser, authLoading]);

  const handleUnlink = async (qrId: number) => {
    if (!currentUser) return;
    setActionLoading(prev => ({ ...prev, [qrId]: true }));
    try {
      const success = await unlinkQrCode(qrId, currentUser.id);
      if (success) {
        toast({ title: "QR Unlinked", description: `QR ID ${qrId} has been unlinked from your account.` });
        fetchQrs(); // Re-fetch to update list
      } else {
        toast({ variant: "destructive", title: "Unlink Failed", description: "Could not unlink this QR code." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setActionLoading(prev => ({ ...prev, [qrId]: false }));
    }
  };

  const handleDelete = async (qrId: number) => {
    if (!currentUser) return;
     setActionLoading(prev => ({ ...prev, [qrId]: true }));
    try {
      const success = await deleteQrCode(qrId, currentUser.id);
      if (success) {
        toast({ title: "QR Deleted", description: `QR ID ${qrId} has been deleted and is now unusable.` });
        fetchQrs(); // Re-fetch to update list
      } else {
        toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete this QR code." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setActionLoading(prev => ({ ...prev, [qrId]: false }));
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to see your linked QR codes.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (linkedQrs.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><QrCode />My QR Codes</CardTitle>
          <CardDescription>Manage QR codes linked to your account.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No QR Codes Yet</p>
          <p className="text-muted-foreground mb-6">You haven&apos;t linked any QR codes to your account. Scan an unclaimed QR code to add it.</p>
          <Button onClick={() => { /* Maybe redirect to a page with instructions or /qr/scan */ toast({ title: "How to link?", description: "Find an unclaimed QR sticker and scan it with your phone!"}); }}>
            Learn How to Link QR Codes
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><QrCode />My QR Codes</CardTitle>
        <CardDescription>Manage QR codes linked to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>QR ID</TableHead>
              <TableHead>Unique ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linkedQrs.map((qr) => (
              <TableRow key={qr.id}>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {/* <Image src={`https://placehold.co/40x40.png?text=${qr.id.substring(2,4)}`} alt={qr.id} width={30} height={30} data-ai-hint="qr code" className="rounded-sm"/> */}
                    {qr.id}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{qr.uniqueId}</TableCell>
                <TableCell>
                  <Badge variant={qr.status === 'Claimed' ? 'default' : 'secondary'}>
                    {qr.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={actionLoading[qr.id]}>
                        {actionLoading[qr.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2Off className="h-4 w-4" />}
                         <span className="ml-1 hidden sm:inline">Unlink</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unlink QR Code {qr.id}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will make the QR code unclaimed and available for others to link. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUnlink(qr.id)} className="bg-orange-500 hover:bg-orange-600">Unlink</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                     <Button variant="destructive" size="sm" disabled={actionLoading[qr.id]}>
                       {actionLoading[qr.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span className="ml-1 hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete QR Code {qr.id}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action is permanent. The QR code will become unusable. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(qr.id)}>Delete Permanently</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
