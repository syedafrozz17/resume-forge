'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { ResumeData, getDefaultResumeData } from '@/lib/default-resume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Download, Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Collapsible section component
function SectionCard({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader
        className="cursor-pointer select-none py-3 px-4 flex flex-row items-center justify-between space-y-0"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </CardHeader>
      {open && <CardContent className="pt-0 px-4 pb-4">{children}</CardContent>}
    </Card>
  );
}

// Jake's Resume Template Preview - Faithful to the original LaTeX Jake template
function JakeResumePreview({ data }: { data: ResumeData }) {
  const personal = data.personal || { name: '', phone: '', email: '', linkedin: '', linkedinLabel: '' };
  const summary = data.summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const education = Array.isArray(data.education) ? data.education : [];

  const page: React.CSSProperties = {
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 10.5,
    color: '#000',
    background: '#fff',
    padding: '36px 48px',
    lineHeight: 1.35,
    minHeight: '100%',
    boxSizing: 'border-box',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    fontVariant: 'small-caps',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    color: '#000',
    marginBottom: 3,
    marginTop: 14,
  };

  const hrStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid #000',
    margin: '2px 0 6px',
  };

  const subheadRow: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  };

  const boldSm: React.CSSProperties = { fontWeight: 700, fontSize: 10.5 };
  const italicSm: React.CSSProperties = { fontStyle: 'italic', fontSize: 10 };

  return (
    <div style={page}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 700, fontVariant: 'small-caps', letterSpacing: '0.04em' }}>
          {personal.name || 'Your Name'}
        </div>
        <div style={{ fontSize: 10, marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0 10px' }}>
          {personal.phone && <span>{personal.phone}</span>}
          {personal.email && (
            <span style={{ color: '#00007f' }}>{personal.email}</span>
          )}
          {personal.linkedin && (
            <span style={{ color: '#00007f' }}>{personal.linkedinLabel || personal.linkedin}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <div style={sectionTitle}>Summary</div>
          <hr style={hrStyle} />
          <div style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 2 }}>{summary}</div>
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <div style={sectionTitle}>Experience</div>
          <hr style={hrStyle} />
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 8 }}>
              <div style={subheadRow}>
                <span style={boldSm}>{exp.company || 'Company'}</span>
                <span style={boldSm}>{[exp.from, exp.to].filter(Boolean).join(' -- ')}</span>
              </div>
              <div style={{ ...subheadRow, marginBottom: 4 }}>
                <span style={italicSm}>{exp.role || 'Role'}</span>
                <span style={italicSm}>{exp.location}</span>
              </div>
              {exp.points.filter(p => p.trim()).length > 0 && (
                <ul style={{ margin: '2px 0 0 16px', padding: 0 }}>
                  {exp.points.filter(p => p.trim()).map((pt, i) => (
                    <li key={i} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 1 }}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && skills.some(s => s.items.trim()) && (
        <>
          <div style={sectionTitle}>Skills</div>
          <hr style={hrStyle} />
          <ul style={{ margin: '2px 0 6px 16px', padding: 0 }}>
            {skills.filter(s => s.items.trim()).map((sk) => (
              <li key={sk.id} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 1 }}>{sk.items}</li>
            ))}
          </ul>
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <div style={sectionTitle}>Education</div>
          <hr style={hrStyle} />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <div style={subheadRow}>
                <span style={boldSm}>{edu.institution || 'Institution'}</span>
                <span style={boldSm}>{[edu.from, edu.to].filter(Boolean).join(' -- ')}</span>
              </div>
              <div style={{ ...subheadRow, marginBottom: 2 }}>
                <span style={italicSm}>{edu.degree}</span>
                <span style={italicSm}>{edu.location}</span>
              </div>
              {edu.coursework && (
                <ul style={{ margin: '2px 0 0 16px', padding: 0 }}>
                  <li style={{ fontSize: 10.5, lineHeight: 1.5 }}>
                    <strong>Relevant Coursework:</strong> {edu.coursework}
                  </li>
                </ul>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function ResumeEditor() {
  const { currentResumeId, setView } = useAppStore();
  const [data, setData] = useState<ResumeData>(getDefaultResumeData());
  const [title, setTitle] = useState('Untitled Resume');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load resume data on mount
  useEffect(() => {
    if (!currentResumeId) {
      setView('dashboard');
      return;
    }

    const loadResume = async () => {
      try {
        const res = await fetch(`/api/resumes/${currentResumeId}`);
        const result = await res.json();
        if (result.success && result.data) {
          setTitle(result.data.title || 'Untitled Resume');
          if (result.data.data && typeof result.data.data === 'object') {
            // Merge loaded data with defaults to ensure all fields exist
            const defaultData = getDefaultResumeData();
            const loadedData = result.data.data;
            setData({
              personal: { ...defaultData.personal, ...(loadedData.personal || {}) },
              summary: loadedData.summary ?? defaultData.summary,
              experience: Array.isArray(loadedData.experience) && loadedData.experience.length > 0
                ? loadedData.experience
                : defaultData.experience,
              skills: Array.isArray(loadedData.skills) && loadedData.skills.length > 0
                ? loadedData.skills
                : defaultData.skills,
              education: Array.isArray(loadedData.education) && loadedData.education.length > 0
                ? loadedData.education
                : defaultData.education,
            });
          }
        } else {
          toast.error('Failed to load resume');
          setView('dashboard');
        }
      } catch {
        toast.error('Failed to load resume');
        setView('dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [currentResumeId, setView]);

  // Debounced save
  const saveData = useCallback(
    async (newData: ResumeData, newTitle?: string) => {
      if (!currentResumeId) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/resumes/${currentResumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTitle || title,
            data: newData,
          }),
        });
        const result = await res.json();
        if (result.success) {
          setLastSaved(new Date());
        }
      } catch {
        // silently fail on auto-save
      } finally {
        setSaving(false);
      }
    },
    [currentResumeId, title]
  );

  const debouncedSave = useCallback(
    (newData: ResumeData, newTitle?: string) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        saveData(newData, newTitle);
      }, 2000);
    },
    [saveData]
  );

  // Update personal field
  const upP = (key: string, value: string) => {
    const newData = {
      ...data,
      personal: { ...data.personal, [key]: value },
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Update experience field
  const upExp = (id: number, key: string, value: string) => {
    const newData = {
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [key]: value } : exp
      ),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Update experience bullet point
  const upExpPt = (id: number, index: number, value: string) => {
    const newData = {
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id
          ? { ...exp, points: exp.points.map((pt, i) => (i === index ? value : pt)) }
          : exp
      ),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Add experience bullet point
  const addExpPt = (id: number) => {
    const newData = {
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, points: [...exp.points, ''] } : exp
      ),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Delete experience bullet point
  const delExpPt = (id: number, index: number) => {
    const newData = {
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id
          ? { ...exp, points: exp.points.filter((_, i) => i !== index) }
          : exp
      ),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Add new experience
  const addExp = () => {
    const newData = {
      ...data,
      experience: [
        ...data.experience,
        {
          id: Date.now(),
          company: '',
          location: '',
          role: '',
          from: '',
          to: '',
          points: [''],
        },
      ],
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Delete experience
  const delExp = (id: number) => {
    const newData = {
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Update skills
  const upSkill = (id: number, value: string) => {
    const newData = {
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, items: value } : s)),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Add new skill row
  const addSkill = () => {
    const newData = {
      ...data,
      skills: [...data.skills, { id: Date.now(), items: '' }],
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Delete skill row
  const delSkill = (id: number) => {
    const newData = {
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Update education field
  const upEdu = (id: number, key: string, value: string) => {
    const newData = {
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [key]: value } : edu
      ),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Add new education
  const addEdu = () => {
    const newData = {
      ...data,
      education: [
        ...data.education,
        {
          id: Date.now(),
          institution: '',
          location: '',
          degree: '',
          from: '',
          to: '',
          coursework: '',
        },
      ],
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Delete education
  const delEdu = (id: number) => {
    const newData = {
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    };
    setData(newData);
    debouncedSave(newData);
  };

  // Update summary
  const upSummary = (value: string) => {
    const newData = { ...data, summary: value };
    setData(newData);
    debouncedSave(newData);
  };

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave(data, newTitle);
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to export PDF');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: letter;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: "Times New Roman", Times, serif;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('dashboard')}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="font-semibold text-lg border-0 shadow-none p-0 h-auto focus-visible:ring-0 max-w-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            )}
            {lastSaved && !saving && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Save className="w-3 h-3" />
                Saved
              </div>
            )}
            <Button
              onClick={handleExportPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 xl:w-5/12 overflow-y-auto border-r border-gray-200 bg-gray-50">
          <div className="p-4 space-y-4 max-w-2xl mx-auto">
            {/* Personal Info */}
            <SectionCard title="Personal Information" defaultOpen={true}>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      value={data.personal.name}
                      onChange={(e) => upP('name', e.target.value)}
                      placeholder="John Doe"
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={data.personal.phone}
                      onChange={(e) => upP('phone', e.target.value)}
                      placeholder="(123) 456-7890"
                      className="rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input
                      value={data.personal.email}
                      onChange={(e) => upP('email', e.target.value)}
                      placeholder="john@example.com"
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">LinkedIn Label</Label>
                    <Input
                      value={data.personal.linkedinLabel}
                      onChange={(e) => upP('linkedinLabel', e.target.value)}
                      placeholder="LinkedIn"
                      className="rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">LinkedIn URL</Label>
                  <Input
                    value={data.personal.linkedin}
                    onChange={(e) => upP('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    className="rounded-lg text-sm"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Summary */}
            <SectionCard title="Summary" defaultOpen={false}>
              <div className="space-y-1">
                <Label className="text-xs">Professional Summary</Label>
                <Textarea
                  value={data.summary}
                  onChange={(e) => upSummary(e.target.value)}
                  placeholder="Brief professional summary highlighting your key qualifications..."
                  rows={4}
                  className="rounded-lg text-sm"
                />
              </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Experience" defaultOpen={true}>
              <div className="space-y-4">
                {data.experience.map((exp, expIdx) => (
                  <div
                    key={exp.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        Experience {expIdx + 1}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => delExp(exp.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Role / Title</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => upExp(exp.id, 'role', e.target.value)}
                            placeholder="Software Engineer"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => upExp(exp.id, 'company', e.target.value)}
                            placeholder="Google"
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Start Date</Label>
                          <Input
                            value={exp.from}
                            onChange={(e) => upExp(exp.id, 'from', e.target.value)}
                            placeholder="Jan 2022"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">End Date</Label>
                          <Input
                            value={exp.to}
                            onChange={(e) => upExp(exp.id, 'to', e.target.value)}
                            placeholder="Present"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => upExp(exp.id, 'location', e.target.value)}
                            placeholder="San Francisco, CA"
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Bullet Points</Label>
                        {exp.points.map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-start gap-2">
                            <span className="mt-2 text-gray-400 text-xs">•</span>
                            <Textarea
                              value={pt}
                              onChange={(e) => upExpPt(exp.id, ptIdx, e.target.value)}
                              placeholder="Describe your achievement or responsibility..."
                              rows={2}
                              className="rounded-lg text-sm flex-1"
                            />
                            {exp.points.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 mt-1 text-gray-400 hover:text-red-500 shrink-0"
                                onClick={() => delExpPt(exp.id, ptIdx)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addExpPt(exp.id)}
                          className="w-full text-xs rounded-lg border-dashed"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Bullet Point
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addExp}
                  className="w-full rounded-lg border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills" defaultOpen={true}>
              <div className="space-y-3">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-start gap-2">
                    <Textarea
                      value={s.items}
                      onChange={(e) => upSkill(s.id, e.target.value)}
                      placeholder="Python, JavaScript, React, Node.js..."
                      rows={2}
                      className="rounded-lg text-sm flex-1"
                    />
                    {data.skills.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 mt-1 text-gray-400 hover:text-red-500 shrink-0"
                        onClick={() => delSkill(s.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className="w-full text-xs rounded-lg border-dashed"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Skill Row
                </Button>
              </div>
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education" defaultOpen={true}>
              <div className="space-y-4">
                {data.education.map((edu, eduIdx) => (
                  <div
                    key={edu.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        Education {eduIdx + 1}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => delEdu(edu.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => upEdu(edu.id, 'institution', e.target.value)}
                            placeholder="Stanford University"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => upEdu(edu.id, 'location', e.target.value)}
                            placeholder="Stanford, CA"
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => upEdu(edu.id, 'degree', e.target.value)}
                          placeholder="B.S. Computer Science"
                          className="rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Start Date</Label>
                          <Input
                            value={edu.from}
                            onChange={(e) => upEdu(edu.id, 'from', e.target.value)}
                            placeholder="Sep 2018"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">End Date</Label>
                          <Input
                            value={edu.to}
                            onChange={(e) => upEdu(edu.id, 'to', e.target.value)}
                            placeholder="Jun 2022"
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Relevant Coursework</Label>
                        <Textarea
                          value={edu.coursework}
                          onChange={(e) => upEdu(edu.id, 'coursework', e.target.value)}
                          placeholder="Data Structures, Algorithms, Machine Learning..."
                          rows={2}
                          className="rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addEdu}
                  className="w-full rounded-lg border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </SectionCard>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="hidden lg:flex w-1/2 xl:w-7/12 bg-gray-200 overflow-y-auto">
          <div className="flex-1 p-6 flex justify-center">
            <div className="w-full max-w-[8.5in]">
              <div
                ref={printRef}
                className="bg-white shadow-xl"
                style={{
                  minHeight: '11in',
                  width: '100%',
                }}
              >
                <JakeResumePreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            const previewPanel = document.getElementById('mobile-preview');
            if (previewPanel) {
              previewPanel.classList.toggle('hidden');
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg h-12 w-12 p-0"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Preview Panel */}
      <div
        id="mobile-preview"
        className="lg:hidden fixed inset-0 z-40 bg-gray-200 overflow-y-auto hidden"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Live Preview</h2>
            <Button
              variant="ghost"
              onClick={() => {
                const previewPanel = document.getElementById('mobile-preview');
                if (previewPanel) {
                  previewPanel.classList.add('hidden');
                }
              }}
            >
              Close
            </Button>
          </div>
          <div
            className="bg-white shadow-xl mx-auto"
            style={{ maxWidth: '8.5in' }}
          >
            <JakeResumePreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
