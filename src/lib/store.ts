import { create } from 'zustand';

export type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'editor';

interface User {
  id: string;
  email: string;
  name: string;
}

interface ResumeMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // View navigation
  view: View;
  setView: (view: View) => void;

  // Resume list
  resumes: ResumeMeta[];
  setResumes: (resumes: ResumeMeta[]) => void;

  // Current editing resume
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;

  // Loading states
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  view: 'landing',
  setView: (view) => set({ view }),
  resumes: [],
  setResumes: (resumes) => set({ resumes }),
  currentResumeId: null,
  setCurrentResumeId: (id) => set({ currentResumeId: id }),
  authLoading: true,
  setAuthLoading: (loading) => set({ authLoading: loading }),
}));
