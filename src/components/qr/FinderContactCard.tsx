//src/components/qr/FinderContactCard.tsx
'use client';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare, QrCode } from 'lucide-react';
import Image from 'next/image';

interface FinderContactCardProps {
  owner: User;
  qrId: number;
}

export function FinderContactCard({ owner, qrId }: FinderContactCardProps) {
  const whatsappMessage = encodeURIComponent(`Hi ${owner.name}, I found your item associated with QR ID: ${qrId}!`);
 
  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <div className="mb-4 rounded-full bg-green-100 p-3 mx-auto w-fit">
          <QrCode className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">You Found Something!</CardTitle>
        <p className="text-gray-600">
              This item belongs to <strong>{owner.name}</strong>. Please use the contact
              information below to return it.
            </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4">
          <div className="flex items-start space-x-3">
            <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a
                href={`mailto:${owner.email}?subject=I found your lost item!`}
                className="font-medium text-blue-600 hover:text-primary-500"
              >
                {owner.email}
              </a>
            </div>
          </div>
         
          {owner.phone && (
            <div className="flex items-start space-x-3">
              <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <a
                  href={`tel:${owner.phone}`}
                  className="font-medium text-blue-600 hover:text-primary-500"
                >
                  {owner.phone}
                </a>
              </div>
            </div>
          )}
         
          {owner.whatsapp && (
            <div className="flex items-start space-x-3">
              <MessageSquare className="mt-0.5 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                <a
                  href={`https://wa.me/${owner.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-primary-500"
                >
                  {owner.whatsapp}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center text-sm">
          <p className="font-medium text-blue-800">Thank you for being a Good Samaritan!</p>
          <p className="mt-1 text-blue-700">
            Your act of kindness is making someone's day much better.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}