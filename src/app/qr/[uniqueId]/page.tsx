// src/app/qr/[uniqueId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getQrCodeByUniqueId, getOwnerByUserId, claimQrCode } from '@/lib/qrService';
import type { QRCode, User } from '@/lib/types';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinderContactCard } from '@/components/qr/FinderContactCard';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QrPage() {
  const params = useParams();
  const uniqueId = params.uniqueId as string;
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [qrCode, setQrCode] = useState<QRCode | null | undefined>(undefined); // undefined for loading, null for not found
  const [owner, setOwner] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchQrData = async () => {
      setIsLoading(true);
      const fetchedQr = await getQrCodeByUniqueId(uniqueId);
      setQrCode(fetchedQr);

      if (fetchedQr && fetchedQr.status === 'Claimed' && fetchedQr.userId) {
        const fetchedOwner = await getOwnerByUserId(fetchedQr.userId);
        setOwner(fetchedOwner);
      }
      setIsLoading(false);
    };

    if (uniqueId) {
      fetchQrData();
    }
  }, [uniqueId]);

  // Clear pendingQrRedirect after rendering the claim screen
  useEffect(() => {
    const pendingQrRedirect = localStorage.getItem('pendingQrRedirect');
    if (pendingQrRedirect === uniqueId && currentUser && qrCode && qrCode.status === 'Unclaimed') {
      localStorage.removeItem('pendingQrRedirect'); // Clean up immediately
    }
  }, [uniqueId, currentUser, qrCode]);

  const handleClaim = async () => {
    if (!qrCode || !currentUser || qrCode.status !== 'Unclaimed') return;
    setIsClaiming(true);
    try {
      const success = await claimQrCode(qrCode.id, currentUser.id); // Use qrCode.id (number)
      if (success) {
        toast({ title: "QR Code Claimed!", description: `QR ID ${qrCode.id} is now linked to your account.`, });
        // Re-fetch QR data to update UI
        const updatedQr = await getQrCodeByUniqueId(uniqueId);
        setQrCode(updatedQr);
        if (updatedQr && updatedQr.userId) {
            const fetchedOwner = await getOwnerByUserId(updatedQr.userId);
            setOwner(fetchedOwner);
        }
        router.push('/dashboard');
      } else {
        toast({ variant: "destructive", title: "Claim Failed", description: "Could not claim this QR code. It might have been claimed by someone else." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Claim Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading || authLoading || isClaiming) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageContainer>
    );
  }

  if (qrCode === null) {
    return (
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
             <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>QR Code Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The QR code you scanned is invalid or no longer exists.</p>
            <Button asChild className="mt-6">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }
  
  if (!qrCode) { // Should be covered by null check, but as a fallback
    return (
      <PageContainer className="flex flex-col items-center justify-center text-center">
         <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Loading QR Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we fetch the QR code details...</p>
             <Loader2 className="mt-4 mx-auto h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (qrCode.status === 'Claimed') {
    if (owner) {
      if (currentUser && currentUser.id === owner.id) {
        return (
          <PageContainer className="flex flex-col items-center justify-center text-center">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>This QR Code is Yours!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>QR ID: <span className="font-mono">{qrCode.id}</span> is already linked to your account.</p>
                <Image
                  src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                  alt={`QR Code ${qrCode.id}`}
                  width={150}
                  height={150}
                  className="mx-auto my-4 border rounded-md shadow-sm"
                  data-ai-hint="qr code"
                />
                <p className="text-sm text-muted-foreground mb-2">Item linked: {qrCode.id}</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </PageContainer>
        );
      }
      return (
        <PageContainer className="flex items-center justify-center">
          <FinderContactCard owner={owner} qrId={qrCode.id} />
        </PageContainer>
      );
    } else {
       // Claimed but owner data not found (should not happen in consistent data)
       return (
         <PageContainer className="flex flex-col items-center justify-center text-center">
            <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle>Error Loading Owner Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This QR code is claimed, but we couldn&apos;t load the owner&apos;s details. Please try again later.</p>
            </CardContent>
            </Card>
         </PageContainer>
       );
    }
  }

  if (qrCode.status === 'Unclaimed') {
    if (currentUser) {
      return (
        <PageContainer className="flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <Image 
                  src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                  alt={`QR Code ${qrCode.id}`}
                  width={150}
                  height={150}
                  className="mx-auto mb-4 border rounded-md shadow-sm"
                  data-ai-hint="qr code"
              />
              <CardTitle>Claim This QR Code?</CardTitle>
              <CardDescription>QR ID: <span className="font-mono">{qrCode.id}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">This QR code is currently unclaimed. Link it to your account to protect your item.</p>
              <Button onClick={handleClaim} disabled={isClaiming} className="w-full">
                {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Claim QR Code
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      );
    } else {
      // Show login/signup options for unauthenticated users
      return (
        <PageContainer className="flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <Image
                src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                alt={`QR Code ${qrCode.id}`}
                width={150}
                height={150}
                className="mx-auto mb-4 border rounded-md shadow-sm"
                data-ai-hint="qr code"
              />
              <CardTitle>Unclaimed QR Code</CardTitle>
              <CardDescription>QR ID: <span className="font-mono">{qrCode.id}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">This QR code is available to be claimed.</p>
              <p className="mb-6 text-muted-foreground">Log in or sign up to link it to your account.</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/login?redirect=/qr/${uniqueId}`}>Login to Claim</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/signup?redirect=/qr/${uniqueId}`}>Sign Up to Claim</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      );
    }
  }

  if (qrCode.status === 'Deleted') {
    return (
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>QR Code Unusable</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This QR code ({qrCode.id}) has been deleted and cannot be used.</p>
            <Button asChild className="mt-6">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // Fallback for any other unhandled state
  return (
    <PageContainer className="flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Unknown QR Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We couldn&apos;t determine the status of this QR code. Please try again or contact support.</p>
          </CardContent>
        </Card>
    </PageContainer>
  );
}