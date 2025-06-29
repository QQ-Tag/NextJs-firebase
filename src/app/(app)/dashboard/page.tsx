'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserQrList } from '@/components/qr/UserQrList';
import Link from 'next/link';
import { Mail, Phone, UserCircle, Edit3, Loader2, QrCode, Shield, Sparkles, Star } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/dashboard');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-0 m-0">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="pt-8">
            <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
            <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 m-0">
      <PageContainer className="py-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center sm:text-left relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {currentUser.name}!
                </h1>
                <p className="text-gray-600 text-lg">Here's an overview of your QQ Tag account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Your Profile
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Summary of your contact information
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" asChild className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                <Link href="/profile" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Email Address</p>
                  <p className="text-gray-900 font-medium">{currentUser.email}</p>
                </div>
              </div>
              
              {currentUser.phone && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Phone Number</p>
                    <p className="text-gray-900 font-medium">{currentUser.phone}</p>
                  </div>
                </div>
              )}
              
              {currentUser.whatsapp && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.206 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700">WhatsApp</p>
                    <p className="text-gray-900 font-medium">{currentUser.whatsapp}</p>
                  </div>
                </div>
              )}
              
              {!currentUser.phone && !currentUser.whatsapp && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact Info</p>
                    <p className="text-gray-500 text-sm">Add phone or WhatsApp</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">Security & Privacy</p>
              </div>
              <p className="text-sm text-blue-600">
                Your contact information is only shared when someone finds your lost item and scans your QR code.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Section */}
        <UserQrList />

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Common tasks and helpful resources
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                <Link href="/profile">
                  <Edit3 className="h-8 w-8 text-blue-500" />
                  <div className="text-center">
                    <p className="font-medium">Update Profile</p>
                    <p className="text-xs text-gray-500">Edit your contact info</p>
                  </div>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'QQ Tag - Lost & Found QR System',
                      text: 'Protect your belongings with QQ Tag QR codes!',
                      url: window.location.origin
                    });
                  }
                }}
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                <QrCode className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <p className="font-medium">Share QQ Tag</p>
                  <p className="text-xs text-gray-500">Tell friends about us</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  window.open('mailto:support@qqtag.com?subject=QQ Tag Support Request', '_blank');
                }}
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                <Mail className="h-8 w-8 text-purple-500" />
                <div className="text-center">
                  <p className="font-medium">Get Support</p>
                  <p className="text-xs text-gray-500">Contact our team</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}