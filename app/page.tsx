'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { AnimationContainer } from '@/components/ui/animation-container';
import { MagicBadge } from '@/components/ui/magic-badge';
import { MagicCard } from '@/components/ui/magic-card';
import { Input } from '@/components/ui/input';

// Lazy load heavy components that use framer-motion
const BorderBeam = dynamic(() => import('@/components/ui/border-beam').then(m => ({ default: m.BorderBeam })), { ssr: false });
const TextHoverEffect = dynamic(() => import('@/components/ui/text-hover-effect').then(m => ({ default: m.TextHoverEffect })), { ssr: false });
const BentoGrid = dynamic(() => import('@/components/ui/bento-grid').then(m => ({ default: m.BentoGrid })), { ssr: false });
const BentoCard = dynamic(() => import('@/components/ui/bento-grid').then(m => ({ default: m.BentoCard })), { ssr: false });
const WorldMap = dynamic(() => import('@/components/ui/world-map'), { ssr: false });

import {
  FileText,
  Languages,
  Shield,
  CheckCircle,
  Users,
  FileCheck,
  Zap,
  ArrowRight,
  Upload,
  Eye,
  Edit3,
  Download,
  Sparkles,
  CreditCard,
  Search,
  Globe,
  Award,
  ChevronDown,
  Plus,
  Minus,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Smart OCR',
    desc: 'Extract text from any document with 99.9% accuracy. PDFs, images, scans - all supported.'
  },
  {
    icon: Languages,
    title: 'AI Translation',
    desc: 'Context-aware translations that understand legal terminology and preserve formatting.'
  },
  {
    icon: Shield,
    title: 'Legal Certificates',
    desc: 'Auto-generate certified translation certificates with your credentials and signature.'
  },
  {
    icon: Users,
    title: 'Team Workspace',
    desc: 'Invite team members, assign documents, and track progress in real-time.'
  },
  {
    icon: FileCheck,
    title: 'Audit Trail',
    desc: 'Complete history of every change. Perfect for compliance and quality assurance.'
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'Reduce translation time by 80%. What took hours now takes minutes.'
  }
];

const PROCESS = [
  {
    icon: Upload,
    title: 'Upload Document',
    description: 'Drop your PDF, image, or Word document. We support 50+ file formats.'
  },
  {
    icon: Eye,
    title: 'Review OCR',
    description: 'Verify the extracted text is accurate with our AI-powered OCR engine.'
  },
  {
    icon: Edit3,
    title: 'Translate & Edit',
    description: 'Edit and approve AI-generated translation with full control.'
  },
  {
    icon: Download,
    title: 'Export & Certify',
    description: 'Download your translation with certificate attached.'
  }
];

// FAQ Accordion Item Component
function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimationContainer delay={0.1 + index * 0.05}>
      <div
        className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'border-purple-200 shadow-lg shadow-purple-100/50' : 'border-gray-200 hover:border-purple-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
        >
          <span className="font-medium text-gray-900 pr-4">{question}</span>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-purple-100 rotate-180' : 'bg-gray-100'
          }`}>
            <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-purple-600' : 'text-gray-500'}`} />
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-5 text-gray-600 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </AnimationContainer>
  );
}

export default function Home() {
  const [isYearly, setIsYearly] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const prices = {
    pro: { monthly: 29, yearly: 255 },
    business: { monthly: 99, yearly: 871 }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden scrollbar-hide relative">
      {/* Grid Pattern Background - Base */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Navigation - Floating Header like Parley */}
      <nav className="fixed w-full z-50 pt-6 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-purple-100 rounded-2xl px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo + Name */}
              <Link href="/" className="flex items-center gap-2">
                <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={36} height={36} className="h-9 w-9" />
                <span className="text-xl font-semibold text-gray-900">EZDocu</span>
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>

              {/* Right side: Nav + Buttons (Desktop) */}
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  How it works
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('faq');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  FAQ
                </button>

                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 bg-white hover:bg-gray-50 rounded-lg ml-2">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-[100] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-purple-900 via-purple-800 to-violet-900 z-[110] transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={32} height={32} className="h-8 w-8" />
              <span className="text-xl font-semibold text-white">EZDocu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => {
                const el = document.getElementById('features');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-white/90 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <Sparkles className="h-5 w-5" />
              Features
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-white/90 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <Eye className="h-5 w-5" />
              How it works
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-white/90 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <CreditCard className="h-5 w-5" />
              Pricing
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('faq');
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-white/90 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <HelpCircle className="h-5 w-5" />
              FAQ
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-6 border-t border-white/20">
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl h-11">
                Log in
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full bg-white hover:bg-gray-100 text-purple-900 rounded-xl h-11 font-semibold">
                Get started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-28 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center w-full text-center">
              <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_85%)_inset] transition-colors duration-200 mb-6">
                  <span>
                    <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,#7c3aed_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                  </span>
                  <span className="backdrop absolute inset-[1px] rounded-full bg-white transition-colors duration-200 group-hover:bg-gray-50" />
                  <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-purple-500/10"></span>
                  <span className="z-10 py-0.5 text-sm text-gray-700 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    AI-Powered Document Translation
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </span>
                </button>

                <h1 className="text-gray-900 text-center py-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance !leading-[1.1] w-full">
                  Translate documents with{' '}
                  <span className="text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">
                    legal precision
                  </span>
                </h1>

                <p className="mb-10 text-lg tracking-tight text-gray-600 md:text-xl text-balance max-w-2xl">
                  Professional OCR and translation platform for certified translators.
                  <br className="hidden md:block" />
                  <span className="hidden md:block">
                    Full control, audit trails, and legal compliance built-in.
                  </span>
                </p>

                <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12">
                      Start free trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-gray-200 bg-white">
                      See how it works
                    </Button>
                  </Link>
                </div>
              </AnimationContainer>

              {/* Hero Image with Border Beam */}
              <AnimationContainer
                delay={0.2}
                className="relative pt-16 pb-16 md:py-24 px-2 bg-transparent w-full max-w-5xl"
              >
                <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
                <div className="relative -m-2 rounded-xl p-2 ring-1 ring-inset ring-gray-300 lg:-m-4 lg:rounded-2xl bg-white/80 backdrop-blur-sm">
                  <BorderBeam size={250} duration={12} delay={9} colorFrom="#a855f7" colorTo="#6366f1" borderWidth={2} />
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-gray-400">EZDocu - Document Workspace</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                      <div className="p-8 bg-gray-50/50">
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Original Document</div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5 mt-6"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-4">Translation</div>
                        <div className="space-y-3">
                          <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                          <div className="h-4 bg-purple-100 rounded w-full"></div>
                          <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                          <div className="h-4 bg-purple-100 rounded w-2/3"></div>
                          <div className="h-4 bg-purple-100 rounded w-4/5 mt-6"></div>
                          <div className="h-4 bg-purple-100 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-white z-40"></div>
                </div>
              </AnimationContainer>
            </div>
          </div>
      </section>

      {/* Trust badges */}
      <section className="py-8 px-4">
        <AnimationContainer delay={0.3}>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
              Trusted by certified translators worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>USCIS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ATA Certified Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>SOC 2 Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>HIPAA Ready</span>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col w-full items-center justify-center py-2">
              <MagicBadge title="Features" />
              <h2 className="text-center text-2xl md:text-4xl !leading-[1.1] font-bold text-gray-900 mt-4">
                Everything you need for professional translation
              </h2>
              <p className="mt-3 text-center text-base text-gray-600 max-w-lg">
                Built specifically for certified translators and legal professionals
              </p>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2}>
            <BentoGrid className="py-2">
              {/* Smart OCR Card */}
              <BentoCard
                name="Smart OCR"
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute top-10 left-10 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-900 mb-2">Upload Document</div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">Drop your files here</span>
                    </div>
                  </div>
                }
                Icon={FileText}
                description="Extract text from any document with 99.9% accuracy."
                href="#"
                cta="Learn more"
              />

              {/* AI Translation Card */}
              <BentoCard
                name="AI Translation"
                className="col-span-3 lg:col-span-2"
                background={
                  <div className="absolute right-10 top-10 w-[70%] border border-gray-200 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-4 rounded-lg bg-white shadow-sm">
                    <Input placeholder="Search documents..." className="mb-3" />
                    <div className="cursor-pointer text-sm">
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">Birth Certificate</span>
                        <span className="text-purple-600">ES → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">Marriage License</span>
                        <span className="text-purple-600">FR → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">Diploma</span>
                        <span className="text-purple-600">DE → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">Passport</span>
                        <span className="text-purple-600">PT → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">Legal Contract</span>
                        <span className="text-purple-600">IT → EN</span>
                      </div>
                    </div>
                  </div>
                }
                Icon={Languages}
                description="Context-aware translations that understand legal terminology."
                href="#"
                cta="Learn more"
              />

              {/* Team Workspace Card */}
              <BentoCard
                name="Team Workspace"
                className="col-span-3 lg:col-span-2"
                background={
                  <div className="absolute right-2 pl-28 md:pl-0 top-4 h-[300px] w-[600px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Connection lines */}
                      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                        <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#e5e7eb" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#e5e7eb" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="20%" y2="60%" stroke="#e5e7eb" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="80%" y2="60%" stroke="#e5e7eb" strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="#e5e7eb" strokeWidth="2" />
                        <line x1="25%" y1="25%" x2="50%" y2="20%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                        <line x1="75%" y1="25%" x2="50%" y2="20%" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                      </svg>
                      {/* Central hub */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-300 z-10">
                        <Globe className="w-8 h-8 text-purple-600" />
                      </div>
                      {/* Connected users */}
                      <div className="absolute left-[25%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="absolute left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                        <FileCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="absolute left-[20%] top-[60%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                        <Edit3 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="absolute left-[80%] top-[60%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center border border-pink-200">
                        <Shield className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="absolute left-[50%] top-[20%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center border border-violet-200">
                        <Zap className="w-5 h-5 text-violet-600" />
                      </div>
                    </div>
                  </div>
                }
                Icon={Users}
                description="Invite team members and track progress in real-time."
                href="#"
                cta="Learn more"
              />

              {/* Legal Certificates Card */}
              <BentoCard
                name="Legal Certificates"
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute right-0 top-10 origin-top rounded-md border border-gray-200 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105 bg-white p-4 shadow-sm">
                    <div className="w-44 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="text-xs font-semibold text-gray-700">Certificate of Translation</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">Certified Translation</span>
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                }
                Icon={Shield}
                description="Auto-generate certified translation certificates."
                href="#"
                cta="Learn more"
              />
            </BentoGrid>
          </AnimationContainer>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-12 px-4 bg-gradient-to-b from-white via-purple-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-center justify-center w-full py-4 max-w-xl mx-auto">
              <MagicBadge title="The Process" />
              <h2 className="text-center text-3xl md:text-5xl !leading-[1.1] font-bold text-gray-900 mt-6">
                Four simple steps to certified translations
              </h2>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-lg">
                Follow these simple steps to translate, certify, and deliver your documents.
              </p>
            </div>
          </AnimationContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full py-4 gap-6">
            {PROCESS.map((process, id) => (
              <AnimationContainer delay={0.15 * id} key={id}>
                <MagicCard className="h-full">
                  <div className="flex flex-col items-start justify-center w-full">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <process.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex flex-col relative items-start mt-4">
                      <span className="absolute -top-2 right-0 bg-purple-600 text-white font-semibold text-lg rounded-full w-8 h-8 flex items-center justify-center">
                        {id + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {process.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {process.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-6 px-4 bg-gradient-to-b from-white via-purple-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-center justify-center w-full py-2 max-w-xl mx-auto">
              <MagicBadge title="Simple Pricing" />
              <h2 className="text-center text-3xl md:text-5xl !leading-[1.1] font-bold text-gray-900 mt-6">
                Choose a plan that works for you
              </h2>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-lg">
                Get started with EZDocu today and enjoy more features with our pro plans.
              </p>

              {/* Monthly/Yearly Toggle */}
              <div className="flex items-center gap-1 mt-8 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    !isYearly
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    isYearly
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6 py-4">
              {/* Free Plan */}
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:border-gray-300 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                  <p className="text-sm text-gray-500 mt-1">For most individuals</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                </div>
                <ul className="space-y-4 text-sm text-gray-600 flex-1">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    5 pages per month
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Basic OCR extraction
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    AI translation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Community support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Basic certificates
                  </li>
                </ul>
                <Link href="/sign-up" className="mt-8">
                  <Button variant="outline" className="w-full h-11 rounded-lg border-gray-200">
                    Start for free
                  </Button>
                </Link>
              </div>

              {/* Pro Plan - Highlighted */}
              <div className="relative rounded-2xl border-2 border-purple-500 bg-white p-6 transition-all hover:shadow-xl flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
                  <p className="text-sm text-gray-500 mt-1">For small businesses</p>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isYearly ? prices.pro.yearly : prices.pro.monthly}
                  </span>
                  <span className="text-gray-500 text-lg">/{isYearly ? 'year' : 'month'}</span>
                  {isYearly && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                      -12%
                    </span>
                  )}
                </div>
                <ul className="space-y-4 text-sm text-gray-600 flex-1">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    100 pages per month
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Advanced OCR extraction
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    AI translation + editing
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Custom certificates
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Audit trail
                  </li>
                </ul>
                <Link href="/sign-up" className="mt-8">
                  <Button className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                    Get started
                  </Button>
                </Link>
              </div>

              {/* Business Plan */}
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:border-gray-300 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Business</h3>
                  <p className="text-sm text-gray-500 mt-1">For large organizations</p>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isYearly ? prices.business.yearly : prices.business.monthly}
                  </span>
                  <span className="text-gray-500 text-lg">/{isYearly ? 'year' : 'month'}</span>
                  {isYearly && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                      -12%
                    </span>
                  )}
                </div>
                <ul className="space-y-4 text-sm text-gray-600 flex-1">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Unlimited pages
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Premium OCR extraction
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    AI translation + editing
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Team workspace (5 users)
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    Dedicated manager
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    API access
                  </li>
                </ul>
                <Link href="/sign-up" className="mt-8">
                  <Button variant="outline" className="w-full h-11 rounded-lg border-gray-200">
                    Contact team
                  </Button>
                </Link>
              </div>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.3}>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-5 h-5" />
                <span>No credit card required for free plan</span>
              </div>
            </div>
          </AnimationContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-center justify-center w-full mb-8">
              <MagicBadge title="FAQ" />
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2}>
            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  question: "What types of documents can EZDocu translate?",
                  answer: "EZDocu supports all common document types including birth certificates, marriage certificates, diplomas, transcripts, passports, driver's licenses, legal contracts, and more. We handle both scanned images and digital PDFs with our advanced OCR technology."
                },
                {
                  question: "Are the translations accepted by USCIS and other government agencies?",
                  answer: "Yes! All translations completed through EZDocu include a Certificate of Translation Accuracy that meets USCIS requirements. Our certified translations are accepted by immigration offices, courts, universities, and government agencies worldwide."
                },
                {
                  question: "How does the AI translation work?",
                  answer: "Our AI uses advanced language models trained specifically on legal and official document terminology. It provides accurate initial translations that certified translators can then review and finalize. This hybrid approach ensures both speed and accuracy."
                },
                {
                  question: "How long does it take to get a certified translation?",
                  answer: "Most single-page documents are completed within 24 hours. Complex multi-page documents may take 2-3 business days. We also offer rush processing for urgent requests at an additional fee."
                },
                {
                  question: "Can I edit the translation before finalizing?",
                  answer: "Absolutely! EZDocu provides a side-by-side editor where you can review the AI-generated translation, make adjustments, and ensure everything is perfect before generating the certified document."
                },
                {
                  question: "What's included in the free plan?",
                  answer: "The free plan includes 5 pages per month, basic OCR extraction, AI translation assistance, community support, and basic certification. It's perfect for individuals with occasional translation needs."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes, security is our top priority. All documents are encrypted in transit and at rest. We're SOC 2 certified and HIPAA compliant. Your documents are automatically deleted after 30 days, or you can delete them immediately after download."
                },
                {
                  question: "Do you offer team or enterprise plans?",
                  answer: "Yes! Our Business plan includes unlimited pages, team workspaces for up to 5 users, dedicated account management, API access, and custom integrations. Contact our sales team for enterprise pricing with additional features."
                }
              ].map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} index={index} />
              ))}
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Link href="mailto:support@ezdocu.com">
                <Button variant="outline" className="rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </AnimationContainer>
        </div>
      </section>

      {/* CTA Section with World Map */}
      <section className="relative overflow-hidden">
        {/* Background with Map */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900" />

        {/* World Map as Background - Hidden on mobile for performance */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center">
          <div className="w-[80%] max-w-5xl h-full">
            <WorldMap
              lineColor="#c4b5fd"
              darkMode={true}
              dots={[
                {
                  start: { lat: 40.7128, lng: -74.006 }, // New York
                  end: { lat: 51.5074, lng: -0.1278 }, // London
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 }, // London
                  end: { lat: 48.8566, lng: 2.3522 }, // Paris
                },
                {
                  start: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                  end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
                },
                {
                  start: { lat: 19.4326, lng: -99.1332 }, // Mexico City
                  end: { lat: -23.5505, lng: -46.6333 }, // Sao Paulo
                },
                {
                  start: { lat: 48.8566, lng: 2.3522 }, // Paris
                  end: { lat: 55.7558, lng: 37.6173 }, // Moscow
                },
                {
                  start: { lat: 55.7558, lng: 37.6173 }, // Moscow
                  end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                },
              ]}
            />
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4">
            <AnimationContainer delay={0.1}>
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Trusted{" "}
                  <span className="text-purple-200">Worldwide</span>
                </h2>
                <p className="text-purple-100 max-w-md mx-auto text-lg mb-6">
                  Join thousands of certified translators who save hours every week with EZDocu.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-purple-900 rounded-full px-8 h-12 font-semibold shadow-lg">
                    Start your free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top section with logo, description and links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
            {/* Logo and description */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={120} height={32} className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-gray-500 max-w-xs">
                Professional document translation platform for certified translators.
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link></li>
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">API Docs</a></li>
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Its Simple AI LLC. All rights reserved.</p>
          </div>

          {/* Large EZDocu text with hover effect */}
          <div className="relative h-40 md:h-60 w-full mt-8 flex items-center justify-center">
            <TextHoverEffect text="EZDocu" />
          </div>
        </div>
      </footer>
    </div>
  );
}
