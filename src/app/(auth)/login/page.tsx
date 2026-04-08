import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4 md:p-8">
      <div className="relative z-10">
        <Suspense fallback={<div className="animate-pulse text-muted-foreground">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
