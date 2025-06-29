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
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, MessageSquare, Save, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional().or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, 'Invalid WhatsApp number').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { currentUser, updateCurrentUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      const values = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
      };
      form.reset(values);
    }
  }, [currentUser, form, authLoading]);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && currentUser) {
        const hasChanged = 
          value.name !== currentUser.name ||
          value.email !== currentUser.email ||
          value.phone !== (currentUser.phone || '') ||
          value.whatsapp !== (currentUser.whatsapp || '');
        setHasChanges(hasChanged);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentUser]);

  async function onSubmit(values: ProfileFormValues) {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await updateCurrentUser(values);
      toast({ 
        variant: "success",
        title: "Profile Updated Successfully!", 
        description: "Your profile information has been saved and applied to all your QR codes.",
        duration: 4000,
      });
      setHasChanges(false);
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Failed to Update Profile", 
        description: error.message || "Could not update your profile. Please check your connection and try again." 
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-0 m-0">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 m-0">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardContent className="pt-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Available</h1>
            <p className="text-gray-600 mb-4">Please log in to view and edit your profile.</p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 m-0">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative mb-6">
          <Button variant="outline" asChild className="mb-4 hover:bg-gray-50">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Edit Your Profile
            </h1>
            <p className="text-gray-600 text-lg">Update your contact information and preferences</p>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="relative shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-xl blur opacity-20"></div>
          
          <div className="relative bg-white rounded-xl m-1">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your personal information and contact details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple-500" />
                          Phone Number (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., +1 123 456 7890" 
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
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-emerald-500" />
                          WhatsApp Number (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., +1 123 456 7890" 
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      type="submit" 
                      className={`flex-1 h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                        hasChanges 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={isLoading || !hasChanges}
                    >
                      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {isLoading ? 'Saving Changes...' : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (currentUser) {
                          form.reset({
                            name: currentUser.name || '',
                            email: currentUser.email || '',
                            phone: currentUser.phone || '',
                            whatsapp: currentUser.whatsapp || '',
                          });
                          setHasChanges(false);
                          toast({
                            variant: "info",
                            title: "Changes Reset",
                            description: "All changes have been reset to your current profile information."
                          });
                        }
                      }}
                      className="h-12 px-8 hover:bg-gray-50 rounded-xl"
                      disabled={isLoading || !hasChanges}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
              
              {/* Info Cards */}
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-700">Privacy & Security</p>
                  </div>
                  <p className="text-sm text-blue-600">
                    Your contact information is only shared when someone finds your lost item and scans your QR code. We never share your data with third parties.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Instant Updates</p>
                  </div>
                  <p className="text-sm text-green-600">
                    Changes to your profile are applied immediately to all your linked QR codes. No need to update each code individually.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}