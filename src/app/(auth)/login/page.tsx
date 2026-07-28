import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Student Portal - OnyxStack Labs',
  description: 'Sign in to access your Student Portal account.',
  alternates: {
    canonical: 'https://student.onyxstacklabs.com/login',
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
