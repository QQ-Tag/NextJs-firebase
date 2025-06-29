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
  // Professional sticker design with better proportions and modern styling
  const sizeStyles = {
    'Extra Small': {
      stickerBox: 'w-20 h-20', // 80px x 80px
      qrContainer: 'w-14 h-14', // 56px x 56px
      qrSize: 52, // QR code size
      textSize: 'text-[0.4rem]', // 6.4px
      idSize: 'text-[0.35rem]', // 5.6px
      padding: 'p-1',
      borderRadius: 'rounded-lg',
      gap: 'gap-0.5'
    },
    'Small': {
      stickerBox: 'w-24 h-24', // 96px x 96px
      qrContainer: 'w-16 h-16', // 64px x 64px
      qrSize: 60,
      textSize: 'text-[0.5rem]', // 8px
      idSize: 'text-[0.45rem]', // 7.2px
      padding: 'p-1.5',
      borderRadius: 'rounded-lg',
      gap: 'gap-1'
    },
    'Medium': {
      stickerBox: 'w-32 h-32', // 128px x 128px
      qrContainer: 'w-22 h-22', // 88px x 88px
      qrSize: 84,
      textSize: 'text-[0.6rem]', // 9.6px
      idSize: 'text-[0.5rem]', // 8px
      padding: 'p-2',
      borderRadius: 'rounded-xl',
      gap: 'gap-1'
    },
    'Large': {
      stickerBox: 'w-40 h-40', // 160px x 160px
      qrContainer: 'w-28 h-28', // 112px x 112px
      qrSize: 108,
      textSize: 'text-xs', // 12px
      idSize: 'text-[0.6rem]', // 9.6px
      padding: 'p-2.5',
      borderRadius: 'rounded-xl',
      gap: 'gap-1.5'
    },
    'Extra Large': {
      stickerBox: 'w-48 h-48', // 192px x 192px
      qrContainer: 'w-32 h-32', // 128px x 128px
      qrSize: 124,
      textSize: 'text-sm', // 14px
      idSize: 'text-xs', // 12px
      padding: 'p-3',
      borderRadius: 'rounded-2xl',
      gap: 'gap-2'
    },
  };

  const currentStyle = sizeStyles[size] || sizeStyles['Medium'];
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/qr/${uniqueId}` : `/qr/${uniqueId}`;

  return (
    <div className="inline-flex flex-col items-center font-sans" style={{ breakInside: 'avoid-page' }}>
      {/* Main Sticker Container */}
      <div className={cn(
        "relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black shadow-2xl print-bg-exact border-2 border-gray-800",
        currentStyle.stickerBox,
        currentStyle.borderRadius,
        currentStyle.padding,
        currentStyle.gap
      )}>
        {/* QR Code Container with white background */}
        <div className={cn(
          "bg-white rounded-lg shadow-inner border border-gray-200 flex items-center justify-center print-bg-exact",
          currentStyle.qrContainer
        )}>
          <QRCodeCanvas
            value={qrUrl}
            size={currentStyle.qrSize}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
            includeMargin={false}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: `${currentStyle.qrSize}px`,
              maxHeight: `${currentStyle.qrSize}px`
            }}
          />
        </div>
        
        {/* Text Label */}
        <div className="text-center">
          <p className={cn(
            "font-bold text-white leading-tight tracking-wide uppercase print-bg-exact",
            currentStyle.textSize
          )}>
            {text}
          </p>
        </div>
        
        {/* Brand/Logo area - small QQ Tag branding */}
        <div className="absolute top-1 right-1 opacity-60">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* QR ID below the sticker */}
      <div className="mt-1 text-center">
        <p className={cn(
          "font-mono font-medium text-gray-700 dark:text-gray-400 tracking-wider",
          currentStyle.idSize
        )}>
          {uniqueId}
        </p>
      </div>
    </div>
  );
}