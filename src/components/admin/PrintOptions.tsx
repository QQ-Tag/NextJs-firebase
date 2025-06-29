'use client';

import type { StickerSize } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Printer, Settings, Palette } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PrintOptionsProps {
  availableSizes: StickerSize[];
  selectedSizes: StickerSize[];
  onSizeChange: (size: StickerSize, checked: boolean) => void;
  onPrint: () => Promise<void> | void;
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
  
  const handlePrint = async () => {
    if (typeof window !== "undefined") {
      if (onPrint) {
        await onPrint();
      }
      setTimeout(() => {
        window.print();
      }, 50);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Print Options</CardTitle>
            <CardDescription className="text-gray-600">Configure your sticker settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Select Sticker Size(s)</h3>
          </div>
          
          {allowMultipleSizes ? (
            <div className="grid grid-cols-1 gap-3">
              {availableSizes.map((size) => (
                <div key={size} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={(checked) => onSizeChange(size, !!checked)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm font-medium text-gray-700 flex-1">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup 
              defaultValue={defaultSelectedSize || availableSizes[0]} 
              onValueChange={onSingleSizeChange}
              className="space-y-3"
            >
              {availableSizes.map((size) => (
                <div key={size} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                  <RadioGroupItem value={size} id={`size-${size}`} className="border-blue-500 text-blue-500" />
                  <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm font-medium text-gray-700 flex-1">
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
        
        <Button 
          onClick={handlePrint} 
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" 
          disabled={
            (allowMultipleSizes && selectedSizes.length === 0) || 
            (!allowMultipleSizes && !defaultSelectedSize && !onSingleSizeChange)
          }
        >
          <Printer className="mr-2 h-5 w-5" />
          Download / Print Selected
        </Button>
        
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-700 font-medium mb-1">💡 Print Instructions</p>
          <p className="text-xs text-blue-600">
            This will prepare a print-friendly page. Use your browser&apos;s print function (Ctrl/Cmd + P) to save as PDF or print directly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}