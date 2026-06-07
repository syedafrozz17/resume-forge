'use client';

import { motion } from 'framer-motion';
import { FileText, Zap, Shield, Download, ChevronRight, Sparkles, PenTool, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const features = [
  {
    icon: FileText,
    title: 'Professional Templates',
    description: 'Choose from industry-standard resume formats that pass ATS systems and impress recruiters.',
  },
  {
    icon: Zap,
    title: 'Real-Time Preview',
    description: 'See your changes instantly with our live preview editor. No more guessing how it will look.',
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
];

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up in seconds and start building your professional resume right away.',
  },
  {
    number: '2',
    title: 'Fill In Your Details',
    description: 'Use our intuitive editor to add your experience, skills, and education.',
  },
  {
    number: '3',
    title: 'Export & Apply',
    description: 'Download your resume as a PDF and start applying with confidence.',
  },
];

export function Landing() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Free & Open Source Resume Builder
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900"
            >
              Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Perfect Resume
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Create stunning, ATS-friendly resumes in minutes with our intuitive editor.
              Real-time preview, professional templates, and instant PDF export.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-200"
                onClick={() => setView('signup')}
              >
                Get Started
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                onClick={() => setView('login')}
              >
                Login
              </Button>
            </motion.div>

            {/* Visual mockup */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 relative"
            >
              <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl shadow-emerald-200/50 border border-emerald-100 p-6 sm:p-8">
                <div className="flex gap-6">
                  <div className="w-1/3 space-y-3">
                    <div className="h-4 bg-emerald-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="mt-4 h-4 bg-emerald-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                  <div className="w-2/3 space-y-3">
                    <div className="h-4 bg-emerald-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                    <div className="mt-4 h-4 bg-emerald-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Powerful features designed to make resume building effortless and effective.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg shadow-gray-100 hover:shadow-emerald-100 hover:border-emerald-200 transition-all duration-300 rounded-xl">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Three simple steps to your professional resume.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative">
                <Card className="h-full border-0 shadow-lg shadow-gray-100 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Join thousands of professionals who have created stunning resumes with ResumeForge.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl shadow-lg"
                onClick={() => setView('signup')}
              >
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">ResumeForge</span>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
