import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { PageContainer } from '@/components/shared/PageContainer';

export default function AdminLoginPage() {
  return (
    <PageContainer className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center">
      <AdminLoginForm />
    </PageContainer>
  );
}
