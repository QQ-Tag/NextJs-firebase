import type { StickerSize } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface QrCodeStickerProps {
  qrId: string;
  uniqueId: string;
  size: StickerSize;
  text: string;
}

export function QrCodeSticker({ qrId, uniqueId, size, text }: QrCodeStickerProps) {
  const sizeClasses = {
    'Extra Small': { container: 'w-16 h-20 p-1', image: 'w-12 h-12', text: 'text-[0.5rem]' },
    'Small': { container: 'w-24 h-28 p-1.5', image: 'w-20 h-20', text: 'text-[0.6rem]' },
    'Medium': { container: 'w-32 h-36 p-2', image: 'w-28 h-28', text: 'text-xs' },
    'Large': { container: 'w-40 h-48 p-2.5', image: 'w-36 h-36', text: 'text-sm' },
    'Extra Large': { container: 'w-48 h-56 p-3', image: 'w-44 h-44', text: 'text-base' },
  };

  const currentSizeStyle = sizeClasses[size] || sizeClasses['Medium'];

  return (
    <div 
      className={cn(
        "inline-flex flex-col items-center justify-between border border-dashed border-gray-400 bg-white text-black font-sans",
        currentSizeStyle.container
      )}
      style={{ breakInside: 'avoid-page' }} // Helps with page breaks during printing
    >
      <Image
        // Using a placeholder that includes the QR ID text for better visual distinction in the demo
        src={`https://placehold.co/${parseInt(currentSizeStyle.image.substring(2))}x${parseInt(currentSizeStyle.image.substring(2))}.png?text=${qrId}`}
        alt={`QR Code for ${qrId}`}
        width={parseInt(currentSizeStyle.image.substring(2))}
        height={parseInt(currentSizeStyle.image.substring(2))}
        className="object-contain"
        data-ai-hint="qr code"
      />
      <p className={cn("mt-1 font-semibold text-center leading-tight", currentSizeStyle.text)}>{text}</p>
      <p className={cn("text-[0.4rem] text-gray-600", currentSizeStyle.text === 'text-[0.5rem]' ? 'text-[0.35rem]' : 'text-[0.4rem]')}>{uniqueId}</p>
    </div>
  );
}
