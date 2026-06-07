'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Landing } from '@/components/landing';
import { AuthForm } from '@/components/auth-form';
import { Dashboard } from '@/components/dashboard';
import { ResumeEditor } from '@/components/resume-editor';
import { Toaster } from 'sonner';

export default function Home() {
  const { user, view, authLoading, setUser, setAuthLoading, setView } = useAppStore();

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUser(data.data);
          setView('dashboard');
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, [setUser, setAuthLoading, setView]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster richColors position="top-right" />
      <main className="flex-1">
        {view === 'landing' && <Landing />}
        {view === 'login' && <AuthForm mode="login" />}
        {view === 'signup' && <AuthForm mode="signup" />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'editor' && <ResumeEditor />}
      </main>
    </div>
  );
}
