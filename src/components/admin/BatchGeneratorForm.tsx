'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateQrBatch } from '@/lib/qrService';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2, PackagePlus, Sparkles } from 'lucide-react';

const formSchema = z.object({
  batchName: z.string().min(3, { message: 'Batch name must be at least 3 characters.' }).max(50, { message: 'Batch name too long.'}),
  quantity: z.coerce.number().int().min(1, { message: 'Quantity must be at least 1.' }).max(10000, {message: 'Max quantity 10,000 per batch.'}),
});

type BatchFormValues = z.infer<typeof formSchema>;

interface BatchGeneratorFormProps {
  onBatchCreated: () => void;
}

export function BatchGeneratorForm({ onBatchCreated }: BatchGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: '',
      quantity: 100,
    },
  });

  async function onSubmit(values: BatchFormValues) {
    setIsLoading(true);
    try {
      const newBatch = await generateQrBatch(values.batchName, values.quantity);
      if (newBatch) {
        toast({
          variant: "success",
          title: "Batch Generated Successfully!",
          description: `Created batch "${newBatch.batchName}" with ${newBatch.quantity} QR codes (${newBatch.startId} - ${newBatch.endId}).`,
        });
        form.reset();
        onBatchCreated();
      } else {
        toast({ 
          variant: "destructive", 
          title: "Failed to Generate Batch", 
          description: "Could not generate the QR code batch. Please try again or contact support." 
        });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Batch Generation Error", 
        description: error.message || "An unexpected error occurred while generating the batch." 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      {/* Gradient header background */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
      
      <CardHeader className="relative pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <PackagePlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Generate New QR Batch
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Create a new batch of unique QR codes for stickers
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Batch Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Batch_Jan2025_CampusA" 
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <PackagePlus className="h-4 w-4 text-purple-500" />
                    Number of QR Codes
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 500" 
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Generating Batch...' : 'Generate Batch'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">💡 Pro Tip</p>
          <p className="text-sm text-blue-600">
            Use descriptive batch names like "Campus_A_Jan2025" to easily identify and manage your QR code collections.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}