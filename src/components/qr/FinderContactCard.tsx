//src/components/qr/FinderContactCard.tsx
'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare } from 'lucide-react';
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
        <Image 
            src="https://placehold.co/150x150.png" 
            alt="Item Found" 
            width={100} 
            height={100} 
            className="mx-auto mb-4 rounded-lg"
            data-ai-hint="lost item"
        />
        <CardTitle className="text-2xl font-semibold">Item Found!</CardTitle>
        <CardDescription>
          This item belongs to {owner.name}. Please use the contact details below to return it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <a href={`mailto:${owner.email}`} className="text-primary hover:underline">
              {owner.email}
            </a>
          </div>
        </div>

        {owner.phone && (
          <div className="flex items-center">
            <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <a href={`tel:${owner.phone}`} className="text-primary hover:underline">
                {owner.phone}
              </a>
            </div>
          </div>
        )}

        {owner.whatsapp && (
          <div className="flex items-center">
            <MessageSquare className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">WhatsApp</p>
              <a
                href={`https://wa.me/${owner.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        )}
        
        <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">Thank you for helping return this item!</p>
        </div>
      </CardContent>
    </Card>
  );
}
