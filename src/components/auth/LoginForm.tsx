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
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, LogIn, Sparkles } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setRedirect(redirectTo || urlParams.get('redirect') || '/dashboard');
    }
  }, [redirectTo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const user = await login(values.email, values.password);
      if (user) {
        toast({ title: 'Login Successful', description: `Welcome back, ${user.name}!` });
        if (redirect && typeof window !== 'undefined') {
          window.location.href = redirect;
        }
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Error', description: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-4 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative backdrop-blur-sm bg-white/90 shadow-2xl border-0 overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl blur opacity-75"></div>
        <div className="relative bg-white rounded-xl m-1">
          <CardHeader className="text-center pb-4 pt-6 px-6">
            <div className="mx-auto mb-3 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs">
              Access your QQ Tag account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-xs">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-8 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-xs"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-xs">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-8 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-xs"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-9 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold text-xs">
                  <Link href="/signup">Create Account</Link>
                </Button>
              </p>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
            
            <GoogleLoginButton />
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">🔐 Secure Login</p>
              <p className="text-xs text-blue-600">
                Your account is protected with industry-standard security.
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}