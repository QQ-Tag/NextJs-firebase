import Link from 'next/link';
import { QrCode } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
      <QrCode className="h-8 w-8" />
      <span>StickerFind</span>
    </Link>
  );
}
