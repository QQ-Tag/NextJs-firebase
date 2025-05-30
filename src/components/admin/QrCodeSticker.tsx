
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
  // Adjusted styles for better proportions and auto-height
  // Padding: pt & px define top/side black borders. pb defines bottom black border.
  // Text margin-top (mt) defines space between QR white box and text.
  const sizeStyles = {
    'Extra Small': { // QR 32px. White box area ~36x36. Text height ~7px.
      stickerBox: 'w-[3rem] pt-[5px] px-[3px] pb-[5px]', // Approx: Top/Side border 3px. Bottom band for text ~12px (mt 2px + text 7px + border_below_text 3px)
      qrBox: 'p-0.5 rounded-sm',      // 2px white padding around QR pattern
      qrSize: 30, // Slightly smaller to fit with padding
      text: 'text-[0.35rem] mt-[2px]',
      idText: 'text-[0.4rem] mt-0.5'
    },
    'Small': { // QR 50px. White box area ~58x58. Text height ~9px.
      stickerBox: 'w-[4.5rem] pt-2 px-1 pb-1.5', // Top/Side border 4px. Bottom band for text ~18px (mt 4px + text 9px + border_below_text 5px)
      qrBox: 'p-1 rounded',           // 4px white padding
      qrSize: 48,
      text: 'text-[0.55rem] mt-1',    // 4px margin-top
      idText: 'text-[0.5rem] mt-1'
    },
    'Medium': { // QR 72px. White box area ~84x84. Text height ~11px.
      stickerBox: 'w-[6rem] pt-2.5 px-1.5 pb-2.5', // Top/Side border 6px. Bottom band for text ~25px (mt 6px + text 11px + border_below_text 8px)
      qrBox: 'p-1.5 rounded-md',      // 6px white padding
      qrSize: 70,
      text: 'text-[0.65rem] mt-1.5',  // 6px margin-top
      idText: 'text-[0.6rem] mt-1'
    },
    'Large': { // QR 90px. White box area ~106x106. Text height ~12px.
      stickerBox: 'w-[7.5rem] pt-3 px-2 pb-3', // Top/Side border 8px. Bottom band for text ~30px (mt 8px + text 12px + border_below_text 10px)
      qrBox: 'p-2 rounded-md',        // 8px white padding
      qrSize: 88,
      text: 'text-xs mt-2',           // 8px margin-top
      idText: 'text-[0.7rem] mt-1.5'
    },
    'Extra Large': { // QR 110px. White box area ~126x126. Text height ~14px.
      stickerBox: 'w-[9rem] pt-3.5 px-2.5 pb-4', // Top/Side border 10px. Bottom band for text ~38px (mt 10px + text 14px + border_below_text 14px)
      qrBox: 'p-2 rounded-lg',        // 8px white padding
      qrSize: 108,
      text: 'text-sm mt-2.5',        // 10px margin-top
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
      {/* The black sticker part. Removed fixed height, justify-center for flex might be better if height is auto based on content + padding. */}
      <div className={cn(
        "bg-black text-white rounded-lg flex flex-col items-center shadow-md print-bg-exact",
        currentStyle.stickerBox // This now includes asymmetric padding and width, but no fixed height.
      )}>
        {/* White area for QR code */}
        <div className={cn("bg-white rounded-md print-bg-exact", currentStyle.qrBox)}>
          <QRCodeCanvas
            value={qrUrl}
            size={currentStyle.qrSize}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            level={"Q"}
            // includeMargin={true} // qrcode.react's includeMargin adds its own margin, better to control with padding on qrBox
          />
        </div>
        {/* "Scan to Return" text */}
        <p className={cn("font-semibold text-center", currentStyle.text)}>{text}</p>
      </div>

      {/* QR ID below the sticker */}
      <p className={cn("font-mono text-center text-neutral-800 dark:text-neutral-300", currentStyle.idText)}>
        {uniqueId}
      </p>
    </div>
  );
}
