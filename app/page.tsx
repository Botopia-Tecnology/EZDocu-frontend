import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Languages,
  Shield,
  CheckCircle,
  Users,
  FileCheck,
  Zap,
  ArrowRight,
  Play,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">EZDocu</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Translation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Translate documents with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> legal precision</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional OCR and translation platform for certified translators.
            Full control, audit trails, and legal compliance built-in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12">
                Start free trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-12 border-gray-200">
                <Play className="mr-2 w-4 h-4" />
                See how it works
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>USCIS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>ATA Certified Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>SOC 2 Security</span>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-400">EZDocu - Document Workspace</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                <div className="p-6 bg-gray-50/50">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Original Document</div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-3">Translation</div>
                  <div className="space-y-2">
                    <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                    <div className="h-4 bg-blue-100 rounded w-full"></div>
                    <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                    <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for professional translation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for certified translators and legal professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
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
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              Four simple steps to certified translations
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drop your PDF, image, or Word document' },
              { step: '02', title: 'Review OCR', desc: 'Verify the extracted text is accurate' },
              { step: '03', title: 'Translate', desc: 'Edit and approve AI-generated translation' },
              { step: '04', title: 'Export', desc: 'Download with certificate attached' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-gray-100 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {i < 3 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-600">
              Pay per page. No subscriptions, no commitments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Scanned Documents</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$1</span>
                <span className="text-gray-500">/ page</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For image-based PDFs, photos, and scanned documents</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  OCR text extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  AI translation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Certificate included
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-blue-500 text-xs font-medium px-2 py-1 rounded-full">Popular</div>
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Digital Documents</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$2</span>
                <span className="text-gray-400">/ page</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">For digital PDFs and Word documents with text layers</p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Layout preservation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  AI translation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Certificate included
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/sign-up">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12">
                Start your free trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">No credit card required</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of translators who save hours every week.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12">
              Create free account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">EZDocu</span>
              </Link>
              <p className="text-sm text-gray-500 max-w-xs">
                Professional document translation platform for certified translators.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-gray-900">Pricing</Link></li>
                  <li><Link href="/sign-up" className="hover:text-gray-900">Sign up</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                  <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Its Simple AI LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
