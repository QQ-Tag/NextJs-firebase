'use client';
import type { StickerSize } from '@/lib/types';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface QrCodeStickerProps {
  qrId: number;
  uniqueId: string;
  size: StickerSize;
  text: string;
}

export function QrCodeSticker({ qrId, uniqueId, size, text }: QrCodeStickerProps) {
  // Clean, professional sticker design with industry-standard proportions
  const sizeStyles = {
    'Extra Small': {
      container: 'w-16 h-20', // 64px x 80px
      qrSize: 48,
      textSize: 'text-[6px]',
      idSize: 'text-[5px]',
      padding: 'p-1',
      gap: 'gap-0.5'
    },
    'Small': {
      container: 'w-20 h-24', // 80px x 96px
      qrSize: 60,
      textSize: 'text-[7px]',
      idSize: 'text-[6px]',
      padding: 'p-1.5',
      gap: 'gap-0.5'
    },
    'Medium': {
      container: 'w-24 h-28', // 96px x 112px
      qrSize: 72,
      textSize: 'text-[8px]',
      idSize: 'text-[7px]',
      padding: 'p-2',
      gap: 'gap-1'
    },
    'Large': {
      container: 'w-28 h-32', // 112px x 128px
      qrSize: 84,
      textSize: 'text-[9px]',
      idSize: 'text-[8px]',
      padding: 'p-2',
      gap: 'gap-1'
    },
    'Extra Large': {
      container: 'w-32 h-36', // 128px x 144px
      qrSize: 96,
      textSize: 'text-[10px]',
      idSize: 'text-[9px]',
      padding: 'p-2.5',
      gap: 'gap-1'
    },
  };

  const currentStyle = sizeStyles[size] || sizeStyles['Medium'];
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/qr/${uniqueId}` : `/qr/${uniqueId}`;

  return (
    <div className="inline-flex flex-col items-center font-sans" style={{ breakInside: 'avoid-page' }}>
      {/* Main Sticker - Clean white design with black border */}
      <div className={cn(
        "bg-white border-2 border-black flex flex-col items-center justify-center print-bg-exact",
        currentStyle.container,
        currentStyle.padding,
        currentStyle.gap
      )}>
        {/* QR Code */}
        <div className="bg-white flex items-center justify-center">
          <QRCodeCanvas
            value={qrUrl}
            size={currentStyle.qrSize}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
            includeMargin={false}
          />
        </div>
        
        {/* Text Label */}
        <div className="text-center">
          <p className={cn(
            "font-bold text-black leading-tight tracking-wide uppercase",
            currentStyle.textSize
          )}>
            {text}
          </p>
        </div>
      </div>

      {/* QR ID below the sticker */}
      <div className="mt-1 text-center">
        <p className={cn(
          "font-mono font-medium text-gray-600 tracking-wider",
          currentStyle.idSize
        )}>
          {uniqueId}
        </p>
      </div>
    </div>
  );
}