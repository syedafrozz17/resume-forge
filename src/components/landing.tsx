'use client';

import { motion } from 'framer-motion';
import {
  FileText, Zap, Shield, Download, ChevronRight, Sparkles, PenTool,
  CheckCircle2, Users, ArrowRight, Eye, Save, LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const features = [
  {
    icon: LayoutTemplate,
    title: 'Professional Templates',
    description: 'Industry-standard resume formats that pass ATS systems and impress recruiters.',
  },
  {
    icon: Eye,
    title: 'Real-Time Preview',
    description: 'See your changes instantly with our live preview. No more guessing how it will look.',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'Built to be compatible with Applicant Tracking Systems so your resume always gets seen.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Export your polished resume as a clean PDF ready to submit to any employer.',
  },
  {
    icon: Save,
    title: 'Auto-Save',
    description: 'Your work is saved automatically every few seconds. Never lose your progress again.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'No bloat, no waiting. Build and edit your resume with instant responsiveness.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up for free in seconds. No credit card required.',
    icon: Users,
  },
  {
    number: '2',
    title: 'Fill In Your Details',
    description: 'Use our intuitive editor to add experience, skills, and education.',
    icon: PenTool,
  },
  {
    number: '3',
    title: 'Export & Apply',
    description: 'Download your resume as PDF and start applying with confidence.',
    icon: FileText,
  },
];



// Mini resume preview component for the hero
function MiniResumePreview() {
  return (
    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
      <div className="p-5" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        {/* Name */}
        <div className="text-center mb-2">
          <div className="text-xl font-bold tracking-wide" style={{ fontVariant: 'small-caps', letterSpacing: '0.04em' }}>
            Sarah Johnson
          </div>
          <div className="text-xs text-gray-500 mt-1 flex justify-center gap-3">
            <span>(555) 123-4567</span>
            <span className="text-blue-800">sarah@email.com</span>
            <span className="text-blue-800">linkedin.com/in/sarah</span>
          </div>
        </div>
        <div className="border-t border-black my-2" />

        {/* Experience */}
        <div className="mb-2">
          <div className="text-xs font-bold tracking-wide" style={{ fontVariant: 'small-caps', textTransform: 'uppercase' }}>
            Experience
          </div>
          <div className="border-t border-black mt-0.5 mb-1.5" />
          <div className="flex justify-between text-xs">
            <span className="font-bold">Senior Developer — TechCorp</span>
            <span className="font-bold">2022 – Present</span>
          </div>
          <ul className="text-xs ml-3 mt-0.5 space-y-0.5 text-gray-700">
            <li>Led team of 8 engineers delivering microservices platform</li>
            <li>Reduced deployment time by 60% through CI/CD optimization</li>
            <li>Architected real-time analytics dashboard serving 50K users</li>
          </ul>
        </div>

        {/* Education */}
        <div className="mb-2">
          <div className="text-xs font-bold tracking-wide" style={{ fontVariant: 'small-caps', textTransform: 'uppercase' }}>
            Education
          </div>
          <div className="border-t border-black mt-0.5 mb-1.5" />
          <div className="flex justify-between text-xs">
            <span className="font-bold">Stanford University</span>
            <span className="font-bold">2018 – 2022</span>
          </div>
          <div className="text-xs italic text-gray-600">B.S. Computer Science — GPA: 3.9</div>
        </div>

        {/* Skills */}
        <div>
          <div className="text-xs font-bold tracking-wide" style={{ fontVariant: 'small-caps', textTransform: 'uppercase' }}>
            Skills
          </div>
          <div className="border-t border-black mt-0.5 mb-1.5" />
          <ul className="text-xs ml-3 space-y-0.5 text-gray-700">
            <li>React, TypeScript, Node.js, Python, PostgreSQL, AWS</li>
            <li>System Design, Agile, Technical Leadership</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">ResumeForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-emerald-700 hidden sm:inline-flex"
              onClick={() => setView('login')}
            >
              Log in
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5"
              onClick={() => setView('signup')}
            >
              Get Started
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section — Two Column */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white flex-1">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Free Resume Builder
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Build Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Perfect Resume
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-5 text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed"
              >
                Create stunning, ATS-friendly resumes in minutes. Real-time preview,
                professional templates, and instant PDF export — all for free.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-6 text-base rounded-xl shadow-lg shadow-emerald-200/50"
                  onClick={() => setView('signup')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-7 py-6 text-base rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setView('login')}
                >
                  Log In
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-6 flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free forever</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF export</span>
              </motion.div>
            </motion.div>

            {/* Right - Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Shadow card behind */}
                <div className="absolute top-4 left-4 w-full h-full bg-emerald-200/30 rounded-lg transform -rotate-3" />
                <MiniResumePreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Powerful features designed to make resume building effortless and effective.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 rounded-xl">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Three simple steps to your professional resume.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {steps.map((step, idx) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative">
                <Card className="h-full border border-gray-100 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white text-lg font-bold flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
                        {step.number}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed ml-16">{step.description}</p>
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-emerald-300" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Ready to Build Your Resume?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto"
            >
              Create a professional, ATS-friendly resume and land your dream job.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl shadow-lg"
                onClick={() => setView('signup')}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                onClick={() => setView('login')}
              >
                Log In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">ResumeForge</span>
              </div>
              <p className="text-sm leading-relaxed">
                Build professional, ATS-friendly resumes in minutes. Free and open source.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Resume Editor</li>
                <li>Live Preview</li>
                <li>PDF Export</li>
                <li>Auto-Save</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>Resume Tips</li>
                <li>ATS Guide</li>
                <li>Templates</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
