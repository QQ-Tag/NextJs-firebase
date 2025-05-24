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
import { Loader2, PackagePlus } from 'lucide-react';

const formSchema = z.object({
  batchName: z.string().min(3, { message: 'Batch name must be at least 3 characters.' }).max(50, { message: 'Batch name too long.'}),
  quantity: z.coerce.number().int().min(1, { message: 'Quantity must be at least 1.' }).max(10000, {message: 'Max quantity 10,000 per batch.'}),
});

type BatchFormValues = z.infer<typeof formSchema>;

interface BatchGeneratorFormProps {
  onBatchCreated: () => void; // Callback to refresh batch list
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
          title: "Batch Generated Successfully!",
          description: `Batch "${newBatch.name}" (${newBatch.startId} - ${newBatch.endId}) created.`,
        });
        form.reset();
        onBatchCreated(); // Trigger refresh of batch list in parent
      } else {
        toast({ variant: "destructive", title: "Batch Generation Failed", description: "Could not generate the batch." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PackagePlus />Generate New QR Batch</CardTitle>
        <CardDescription>Create a new batch of unique QR codes for stickers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Batch_Jan2025_CampusA" {...field} />
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
                  <FormLabel>Number of QR Codes</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Batch
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
