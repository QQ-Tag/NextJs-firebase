'use client';

import type { StickerSize } from '@/lib/types';
import { STICKER_SIZES } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface PrintOptionsProps {
  availableSizes: StickerSize[];
  selectedSizes: StickerSize[];
  onSizeChange: (size: StickerSize, checked: boolean) => void;
  onPrint: () => void;
  allowMultipleSizes?: boolean;
  defaultSelectedSize?: StickerSize;
  onSingleSizeChange?: (size: StickerSize) => void;
}

export function PrintOptions({ 
  availableSizes, 
  selectedSizes, 
  onSizeChange, 
  onPrint, 
  allowMultipleSizes = false,
  defaultSelectedSize,
  onSingleSizeChange
}: PrintOptionsProps) {
  
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      onPrint(); // This might set up the content for printing
      setTimeout(() => window.print(), 100); // Allow content to render before printing
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-card shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Sticker Size(s)</h3>
        {allowMultipleSizes ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50 transition-colors">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => onSizeChange(size, !!checked)}
                />
                <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm font-medium">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup 
            defaultValue={defaultSelectedSize || availableSizes[0]} 
            onValueChange={onSingleSizeChange}
            className="space-y-2"
          >
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm font-medium">
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
      <Button onClick={handlePrint} className="w-full" disabled={!allowMultipleSizes && !defaultSelectedSize && (!onSingleSizeChange || selectedSizes.length === 0) || (allowMultipleSizes && selectedSizes.length === 0)}>
        <Printer className="mr-2 h-4 w-4" />
        Download / Print Selected
      </Button>
       <p className="text-xs text-muted-foreground text-center">
        This will prepare a print-friendly page. Use your browser&apos;s print function to save as PDF or print directly.
      </p>
    </div>
  );
}
