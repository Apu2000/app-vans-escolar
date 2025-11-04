'use client';

import { useApp } from '@/lib/app-context';
import LoginForm from '@/components/LoginForm';
import StudentDashboard from '@/components/StudentDashboard';
import DriverDashboard from '@/components/DriverDashboard';

export default function Home() {
  const { state } = useApp();

  if (!state.user?.isAuthenticated) {
    return <LoginForm />;
  }

  if (state.user.type === 'aluno') {
    return <StudentDashboard />;
  }

  if (state.user.type === 'condutor') {
    return <DriverDashboard />;
  }

  return <LoginForm />;
}