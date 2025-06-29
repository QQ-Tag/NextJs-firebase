'use client';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare, QrCode, Heart, CheckCircle, ExternalLink } from 'lucide-react';

interface FinderContactCardProps {
  owner: User;
  qrId: number;
}

export function FinderContactCard({ owner, qrId }: FinderContactCardProps) {
  const whatsappMessage = encodeURIComponent(`Hi ${owner.name}, I found your item associated with QR ID: ${qrId}!`);
 
  return (
    <div className="w-full max-w-lg mx-4 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
        
        <div className="relative bg-white rounded-xl m-1">
          <CardHeader className="text-center pb-4 pt-6 px-6">
            <div className="mx-auto mb-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              You Found Something!
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              This item belongs to <span className="font-semibold text-gray-900">{owner.name}</span>. 
              Please use the contact information below to return it.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              {/* Email */}
              <div className="group">
                <a
                  href={`mailto:${owner.email}?subject=I found your lost item!&body=Hi ${owner.name},%0A%0AI found your item associated with QR ID: ${qrId}. Please let me know how we can arrange to return it to you.%0A%0AThank you!`}
                  className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-700 mb-1">Send Email</p>
                    <p className="text-blue-900 font-medium truncate">{owner.email}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-blue-500 group-hover:text-blue-700 transition-colors" />
                </a>
              </div>

              {/* Phone */}
              {owner.phone && (
                <div className="group">
                  <a
                    href={`tel:${owner.phone}`}
                    className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-700 mb-1">Call Phone</p>
                      <p className="text-green-900 font-medium truncate">{owner.phone}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-green-500 group-hover:text-green-700 transition-colors" />
                  </a>
                </div>
              )}

              {/* WhatsApp */}
              {owner.whatsapp && (
                <div className="group">
                  <a
                    href={`https://wa.me/${owner.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-700 mb-1">WhatsApp Message</p>
                      <p className="text-emerald-900 font-medium truncate">{owner.whatsapp}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-emerald-500 group-hover:text-emerald-700 transition-colors" />
                  </a>
                </div>
              )}
            </div>

            {/* Thank You Message */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  Thank You for Being a Good Samaritan!
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your act of kindness is making someone's day much better. The owner will be so grateful to get their item back!
              </p>
            </div>

            {/* QR Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                QR Code ID: <span className="font-mono font-medium text-gray-700">{qrId}</span>
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}