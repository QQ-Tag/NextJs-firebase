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
import { Trash2, Link2Off, Loader2, Info, QrCode, MoreVertical } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

export function UserQrList() {
  const { currentUser, loading: authLoading } = useAuth();
  const [linkedQrs, setLinkedQrs] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const fetchQrs = async () => {
    if (currentUser) {
      setIsLoading(true);
      const qrs = await getUserLinkedQrCodes(currentUser.id);
      setLinkedQrs(qrs.filter(qr => qr.status === 'Claimed'));
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
        fetchQrs();
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
        fetchQrs();
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
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your QR codes...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            My QR Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to see your linked QR codes.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (linkedQrs.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My QR Codes
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage QR codes linked to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center py-20">
          <Info className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No QR Codes Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't linked any QR codes to your account. Scan an unclaimed QR code to add it.
          </p>
          <Button 
            onClick={() => { 
              toast({ 
                title: "How to link QR codes", 
                description: "Find an unclaimed QR sticker and scan it with your phone's camera!" 
              }); 
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Learn How to Link QR Codes
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My QR Codes
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage QR codes linked to your account
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Mobile view */}
        <div className="block sm:hidden">
          {linkedQrs.map((qr) => (
            <div key={qr.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border border-blue-200">
                      <QrCode className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">QR {qr.id}</h3>
                      <p className="text-sm text-gray-600 font-mono">{qr.uniqueId}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    {qr.status}
                  </Badge>
                </div>
                
                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={actionLoading[qr.id]}
                        className="w-full h-10 justify-center border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      >
                        {actionLoading[qr.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Link2Off className="h-4 w-4 mr-2" />
                        )}
                        Unlink QR Code
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
                        <AlertDialogAction 
                          onClick={() => handleUnlink(qr.id)} 
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Unlink
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        disabled={actionLoading[qr.id]}
                        className="w-full h-10 justify-center"
                      >
                        {actionLoading[qr.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete Permanently
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
                        <AlertDialogAction onClick={() => handleDelete(qr.id)}>
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
                <TableHead className="font-semibold text-gray-700">Unique ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedQrs.map((qr) => (
                <TableRow key={qr.id} className="hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-mono font-medium text-gray-900">{qr.id}</TableCell>
                  <TableCell className="font-mono text-gray-600">{qr.uniqueId}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                      {qr.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={actionLoading[qr.id]}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                          >
                            {actionLoading[qr.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Link2Off className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden lg:inline">Unlink</span>
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
                            <AlertDialogAction 
                              onClick={() => handleUnlink(qr.id)} 
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Unlink
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            disabled={actionLoading[qr.id]}
                          >
                            {actionLoading[qr.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden lg:inline">Delete</span>
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
                            <AlertDialogAction onClick={() => handleDelete(qr.id)}>
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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