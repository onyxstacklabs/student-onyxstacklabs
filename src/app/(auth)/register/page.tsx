import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Student Portal - OnyxStack Labs',
  description: 'Create an account to access the Student Portal.',
  alternates: {
    canonical: 'https://student.onyxstacklabs.com/register',
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
