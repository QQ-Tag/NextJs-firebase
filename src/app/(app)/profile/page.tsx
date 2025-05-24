'use client';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PageContainer } from '@/components/shared/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/profile');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageContainer>
    );
  }

  if (!currentUser) {
     // This will be brief as the redirect should occur
    return (
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Redirecting to login...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col items-center py-8">
      <ProfileForm />
    </PageContainer>
  );
}
