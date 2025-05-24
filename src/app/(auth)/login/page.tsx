import { LoginForm } from '@/components/auth/LoginForm';
import { PageContainer } from '@/components/shared/PageContainer';

export default function LoginPage() {
  return (
    <PageContainer className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center">
      <LoginForm />
    </PageContainer>
  );
}
