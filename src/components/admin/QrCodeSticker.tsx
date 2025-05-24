
'use client';
import type { StickerSize } from '@/lib/types';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface QrCodeStickerProps {
  qrId: string;
  uniqueId: string;
  size: StickerSize;
  text: string;
}

export function QrCodeSticker({ qrId, uniqueId, size, text }: QrCodeStickerProps) {
  const sizeStyles = {
    'Extra Small': { container: 'w-16 h-24 p-1', qrSize: 48, text: 'text-[0.5rem] leading-tight', tag: 'text-[0.45rem]', uid: 'text-[0.35rem]' },
    'Small': { container: 'w-24 h-32 p-1.5', qrSize: 72, text: 'text-[0.6rem] leading-tight', tag: 'text-[0.55rem]', uid: 'text-[0.4rem]' },
    'Medium': { container: 'w-32 h-40 p-2', qrSize: 100, text: 'text-xs leading-tight', tag: 'text-[0.65rem]', uid: 'text-[0.5rem]' },
    'Large': { container: 'w-40 h-48 p-2.5', qrSize: 128, text: 'text-sm leading-tight', tag: 'text-xs', uid: 'text-[0.6rem]' },
    'Extra Large': { container: 'w-48 h-56 p-3', qrSize: 150, text: 'text-base leading-tight', tag: 'text-sm', uid: 'text-xs' },
  };

  const currentStyle = sizeStyles[size] || sizeStyles['Medium'];
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/qr/${uniqueId}` : `/qr/${uniqueId}`;

  return (
    <div 
      className={cn(
        "inline-flex flex-col items-center justify-around border border-dashed border-gray-400 bg-white text-black font-sans",
        currentStyle.container
      )}
      style={{ breakInside: 'avoid-page' }} // Helps with page breaks during printing
    >
      <div className="flex-shrink-0" style={{ width: currentStyle.qrSize, height: currentStyle.qrSize }}>
        <QRCodeCanvas
          value={qrUrl}
          size={currentStyle.qrSize}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"} // Quality level for QR code
          includeMargin={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="text-center mt-1 flex-grow flex flex-col justify-center">
        <p className={cn("font-semibold", currentStyle.text)}>{text}</p>
        <p className={cn("font-mono font-medium", currentStyle.tag)}>{qrId}</p>
        <p className={cn("text-gray-600 font-mono", currentStyle.uid)}>{uniqueId}</p>
      </div>
    </div>
  );
}
