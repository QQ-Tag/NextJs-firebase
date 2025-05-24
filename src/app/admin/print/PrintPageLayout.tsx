import type { ReactNode } from 'react';

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
          /* Ensure ShadCN components don't interfere with print */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        <div className="no-print mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            Adjust print options and then use your browser&apos;s print functionality (Ctrl/Cmd + P).
          </p>
        </div>
        {children}
      </div>
    </>
  );
}
