'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getQrCodeByUniqueId, getOwnerByUserId, claimQrCode } from '@/lib/qrService';
import type { QRCode, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinderContactCard } from '@/components/qr/FinderContactCard';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle, AlertTriangle, HelpCircle, QrCode, UserCircle, LogIn, UserPlus, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QrPage() {
  const params = useParams();
  const uniqueId = params.uniqueId as string;
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [qrCode, setQrCode] = useState<QRCode | null | undefined>(undefined);
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

  useEffect(() => {
    const pendingQrRedirect = localStorage.getItem('pendingQrRedirect');
    if (pendingQrRedirect === uniqueId && currentUser && qrCode && qrCode.status === 'Unclaimed') {
      localStorage.removeItem('pendingQrRedirect');
    }
  }, [uniqueId, currentUser, qrCode]);

  const handleClaim = async () => {
    if (!qrCode || !currentUser || qrCode.status !== 'Unclaimed') return;
    setIsClaiming(true);
    try {
      const success = await claimQrCode(qrCode.id, currentUser.id);
      if (success) {
        toast({ 
          variant: "success",
          title: "QR Code Claimed Successfully!", 
          description: `QR ID ${qrCode.id} is now linked to your account and ready to protect your item.` 
        });
        const updatedQr = await getQrCodeByUniqueId(uniqueId);
        setQrCode(updatedQr);
        if (updatedQr && updatedQr.userId) {
          const fetchedOwner = await getOwnerByUserId(updatedQr.userId);
          setOwner(fetchedOwner);
        }
        router.push('/dashboard');
      } else {
        toast({ 
          variant: "destructive", 
          title: "Claim Failed", 
          description: "Could not claim this QR code. It might have been claimed by someone else." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Claim Error", 
        description: error.message || "An unexpected error occurred." 
      });
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading || authLoading || isClaiming) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-0 m-0">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {isClaiming ? 'Claiming QR code...' : 'Loading QR information...'}
          </p>
        </div>
      </div>
    );
  }

  if (qrCode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <div className="w-full max-w-md mx-4 relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-red-600/20 rounded-full blur-3xl"></div>
          </div>

          <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-600 to-red-600 rounded-xl blur opacity-75"></div>
            <div className="relative bg-white rounded-xl m-1">
              <CardHeader className="text-center pb-4 pt-6 px-6">
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  QR Code Not Found
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  The QR code you scanned is invalid or no longer exists.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl">
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!qrCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <div className="w-full max-w-md mx-4 relative">
          <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
            <CardHeader className="text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl font-bold text-gray-900">Loading QR Information</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Please wait while we fetch the QR code details...</p>
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (qrCode.status === 'Claimed') {
    if (owner) {
      if (currentUser && currentUser.id === owner.id) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
            <div className="w-full max-w-md mx-4 relative">
              {/* Background decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
              </div>

              <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-white rounded-xl m-1">
                  <CardHeader className="text-center pb-4 pt-6 px-6">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <QrCode className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      This QR Code is Yours!
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      QR ID <span className="font-mono font-semibold text-gray-900">{qrCode.id}</span> is already linked to your account.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <div className="mb-6">
                      <Image
                        src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                        alt={`QR Code ${qrCode.id}`}
                        width={150}
                        height={150}
                        className="mx-auto border-2 border-gray-200 rounded-xl shadow-lg"
                        data-ai-hint="qr code"
                      />
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <p className="text-sm font-medium text-blue-700">Protected Item</p>
                      </div>
                      <p className="text-sm text-blue-600">
                        When someone else scans this QR code, they'll see your contact information to return your lost item.
                      </p>
                    </div>
                    
                    <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl">
                      <Link href="/dashboard" className="flex items-center justify-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        );
      }
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
          <FinderContactCard owner={owner} qrId={qrCode.id} />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
          <div className="w-full max-w-md mx-4 relative">
            <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <CardHeader className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-xl font-bold text-gray-900">Error Loading Owner Details</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">This QR code is claimed, but we couldn&apos;t load the owner&apos;s details. Please try again later.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  if (qrCode.status === 'Unclaimed') {
    if (currentUser) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
          <div className="w-full max-w-md mx-4 relative">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
            </div>

            <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-white rounded-xl m-1">
                <CardHeader className="text-center pb-4 pt-6 px-6">
                  <div className="mx-auto mb-4 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                      <QrCode className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Claim This QR Code?
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    QR ID: <span className="font-mono font-semibold text-gray-900">{qrCode.id}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <div className="mb-6">
                    <Image 
                      src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                      alt={`QR Code ${qrCode.id}`}
                      width={150}
                      height={150}
                      className="mx-auto border-2 border-gray-200 rounded-xl shadow-lg"
                      data-ai-hint="qr code"
                    />
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-700">Available to Claim</p>
                    </div>
                    <p className="text-sm text-green-600">
                      This QR code is currently unclaimed. Link it to your account to protect your item.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleClaim} 
                    disabled={isClaiming} 
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {isClaiming && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {isClaiming ? 'Claiming QR Code...' : 'Claim QR Code'}
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
          <div className="w-full max-w-md mx-4 relative">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
            </div>

            <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-white rounded-xl m-1">
                <CardHeader className="text-center pb-4 pt-6 px-6">
                  <div className="mx-auto mb-4 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                      <QrCode className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Unclaimed QR Code
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    QR ID: <span className="font-mono font-semibold text-gray-900">{qrCode.id}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <div className="mb-6">
                    <Image
                      src={`https://placehold.co/150x150.png?text=${qrCode.id}`}
                      alt={`QR Code ${qrCode.id}`}
                      width={150}
                      height={150}
                      className="mx-auto border-2 border-gray-200 rounded-xl shadow-lg"
                      data-ai-hint="qr code"
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-blue-700">Available to Claim</p>
                    </div>
                    <p className="text-sm text-blue-600">
                      This QR code is available to be claimed. Log in or sign up to link it to your account.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                      <Link href={`/login?redirect=/qr/${uniqueId}`} className="flex items-center justify-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Login to Claim
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-semibold">
                      <Link href={`/signup?redirect=/qr/${uniqueId}`} className="flex items-center justify-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up to Claim
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      );
    }
  }

  if (qrCode.status === 'Deleted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <div className="w-full max-w-md mx-4 relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-red-600/20 rounded-full blur-3xl"></div>
          </div>

          <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-600 to-red-600 rounded-xl blur opacity-75"></div>
            <div className="relative bg-white rounded-xl m-1">
              <CardHeader className="text-center pb-4 pt-6 px-6">
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  QR Code Unusable
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  This QR code ({qrCode.id}) has been deleted and cannot be used.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl">
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback for any other unhandled state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
      <div className="w-full max-w-md mx-4 relative">
        <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-xl font-bold text-gray-900">Unknown QR Status</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">We couldn&apos;t determine the status of this QR code. Please try again or contact support.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}