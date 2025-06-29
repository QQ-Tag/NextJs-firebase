import type { ReactNode } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PrintPageLayoutProps {
  children: ReactNode;
  title: string;
}

export default function PrintPageLayout({ children, title }: PrintPageLayoutProps) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-6 lg:py-8 m-0">
        <div className="no-print mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-gray-600 mt-2">
                Adjust print options and then use your browser&apos;s print functionality (Ctrl/Cmd + P).
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild className="hover:bg-gray-50">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              
              <Button 
                onClick={() => window.print()} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Printer className="h-4 w-4 mr-2" />
                Quick Print
              </Button>
            </div>
          </div>
        </div>
        
        {children}
      </div>
    </>
  );
}