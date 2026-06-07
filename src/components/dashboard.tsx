'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileText, Edit, Trash2, Copy, MoreVertical, LogOut, User, Loader2 } from 'lucide-react';
import { getDefaultResumeData } from '@/lib/default-resume';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function Dashboard() {
  const { user, resumes, setResumes, setUser, setView, setCurrentResumeId } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      if (data.success) {
        setResumes(data.data);
      }
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Resume', data: getDefaultResumeData() }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentResumeId(data.data.id);
        setView('editor');
        toast.success('Resume created!');
      } else {
        toast.error(data.message || 'Failed to create resume');
      }
    } catch {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResumes(resumes.filter((r) => r.id !== id));
        toast.success('Resume deleted');
      } else {
        toast.error(data.message || 'Failed to delete resume');
      }
    } catch {
      toast.error('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (resume: Resume) => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${resume.title} (Copy)`, sourceId: resume.id }),
      });
      const data = await res.json();
      if (data.success) {
        setResumes([...resumes, data.data]);
        toast.success('Resume duplicated!');
      } else {
        toast.error(data.message || 'Failed to duplicate resume');
      }
    } catch {
      toast.error('Failed to duplicate resume');
    }
  };

  const handleEdit = (id: string) => {
    setCurrentResumeId(id);
    setView('editor');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
    setView('landing');
    toast.success('Logged out');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">
                Welcome, {user?.name || 'User'}
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
            <p className="text-gray-600 mt-1">Create and manage your professional resumes</p>
          </div>
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first resume and start building your professional career.
            </p>
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <Card
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer rounded-xl"
              onClick={handleCreate}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Plus className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="font-semibold text-emerald-700">Create New Resume</p>
              </CardContent>
            </Card>

            {/* Resume Cards */}
            {resumes.map((resume) => (
              <Card key={resume.id} className="shadow-md hover:shadow-lg transition-all rounded-xl group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{resume.title}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(resume.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(resume.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          disabled={deletingId === resume.id}
                        >
                          {deletingId === resume.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &ldquo;{resume.title}&rdquo;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(resume.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
