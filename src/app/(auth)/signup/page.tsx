import { SignupForm } from '@/components/auth/SignupForm';
import { PageContainer } from '@/components/shared/PageContainer';

export default function SignupPage() {
  return (
    <PageContainer className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center">
      <SignupForm />
    </PageContainer>
  );
}
