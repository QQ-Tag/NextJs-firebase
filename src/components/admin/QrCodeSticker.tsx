
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
    'Extra Small': { 
      stickerBox: 'w-[4rem] h-[5.25rem] p-1', 
      qrBox: 'p-0.5 rounded-sm',      
      qrSize: 32,                     
      text: 'text-[0.45rem] mt-0.5',  
      idText: 'text-[0.4rem] mt-0.5'  
    },
    'Small': { 
      stickerBox: 'w-[6rem] h-[7.5rem] p-1.5',
      qrBox: 'p-1 rounded',
      qrSize: 50,
      text: 'text-[0.55rem] mt-1',
      idText: 'text-[0.5rem] mt-1'
    },
    'Medium': { 
      stickerBox: 'w-[8rem] h-[9.75rem] p-2', 
      qrBox: 'p-1.5 rounded-md',         
      qrSize: 72,                        
      text: 'text-[0.65rem] mt-1.5',       
      idText: 'text-[0.6rem] mt-1'     
    },
    'Large': { 
      stickerBox: 'w-[10rem] h-[12rem] p-2',
      qrBox: 'p-2 rounded-md',
      qrSize: 90,
      text: 'text-xs mt-2',
      idText: 'text-[0.7rem] mt-1.5'
    },
    'Extra Large': { 
      stickerBox: 'w-[12rem] h-[14.25rem] p-2.5',
      qrBox: 'p-2 rounded-lg',
      qrSize: 110,
      text: 'text-sm mt-2.5',
      idText: 'text-xs mt-1.5'
    },
  };

  const currentStyle = sizeStyles[size] || sizeStyles['Medium'];
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/qr/${uniqueId}` : `/qr/${uniqueId}`;

  return (
    <div 
      className={cn("inline-flex flex-col items-center font-sans")}
      style={{ breakInside: 'avoid-page' }}
    >
      {/* The black sticker part */}
      <div className={cn(
        "bg-black text-white rounded-lg flex flex-col items-center justify-center shadow-md print-bg-exact", // Added print-bg-exact
        currentStyle.stickerBox 
      )}>
        {/* White area for QR code */}
        <div className={cn("bg-white rounded-md print-bg-exact", currentStyle.qrBox)}> {/* Added print-bg-exact for the white box too */}
          <QRCodeCanvas
            value={qrUrl}
            size={currentStyle.qrSize}
            bgColor={"#FFFFFF"} 
            fgColor={"#000000"} 
            level={"Q"} 
            includeMargin={true} 
          />
        </div>
        {/* "Scan to Return" text */}
        <p className={cn("font-semibold text-center", currentStyle.text)}>{text}</p>
      </div>

      {/* QR ID below the sticker */}
      <p className={cn("font-mono text-center text-neutral-800 dark:text-neutral-300", currentStyle.idText)}>
        {qrId}
      </p>
    </div>
  );
}
