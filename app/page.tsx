'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { AnimationContainer } from '@/components/ui/animation-container';
import { MagicBadge } from '@/components/ui/magic-badge';
import { MagicCard } from '@/components/ui/magic-card';
import { Input } from '@/components/ui/input';

type Lang = 'en' | 'es' | 'pt';

const translations = {
  en: {
    features: 'Features',
    howItWorks: 'How it works',
    pricing: 'Pricing',
    faq: 'FAQ',
    login: 'Log in',
    getStarted: 'Get started',
    heroTitle: 'Translate documents with',
    heroTitleHighlight: 'legal precision',
    heroDesc: 'Professional OCR and translation platform for certified translators.',
    heroDesc2: 'Full control, audit trails, and legal compliance built-in.',
    startTrial: 'Start free trial',
    seeHow: 'See how it works',
    badge: 'AI-Powered Document Translation',
    trusted: 'Trusted by certified translators worldwide',
    uscis: 'USCIS Compliant',
    ata: 'ATA Certified Support',
    soc2: 'SOC 2 Security',
    hipaa: 'HIPAA Ready',
    featuresTitle: 'Everything you need for professional translation',
    featuresDesc: 'Built specifically for certified translators and legal professionals',
    processTitle: 'Four simple steps to certified translations',
    processDesc: 'Follow these simple steps to translate, certify, and deliver your documents.',
    step1: 'Upload Document',
    step1Desc: 'Drop your PDF, image, or Word document. We support 50+ file formats including scanned documents, photos, and digital files.',
    step2: 'Review OCR',
    step2Desc: 'Verify the extracted text is accurate with our AI-powered OCR engine. Make corrections if needed before translation.',
    step3: 'Translate & Edit',
    step3Desc: 'Edit and approve AI-generated translation with full control. Side-by-side editor lets you perfect every detail.',
    step4: 'Export & Certify',
    step4Desc: 'Download your translation with certificate attached. Ready for USCIS, courts, and official submissions.',
    pricingTitle: 'Choose a plan that works for you',
    pricingDesc: 'Get started with EZDocu today and enjoy more features with our pro plans.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    free: 'Free',
    forIndividuals: 'For most individuals',
    pro: 'Pro',
    forSmall: 'For small businesses',
    business: 'Business',
    forLarge: 'For large organizations',
    mostPopular: 'Most Popular',
    startFree: 'Start for free',
    contactTeam: 'Contact team',
    noCard: 'No credit card required for free plan',
    trustedWorldwide: 'Trusted',
    worldwide: 'Worldwide',
    ctaDesc: 'Join thousands of certified translators who save hours every week with EZDocu.',
    startYourTrial: 'Start your free trial',
    stillQuestions: 'Still have questions?',
    contactSupport: 'Contact Support',
    faq1Q: 'What types of documents can EZDocu translate?',
    faq1A: 'EZDocu supports all common document types including birth certificates, marriage certificates, diplomas, transcripts, passports, driver\'s licenses, legal contracts, and more. We handle both scanned images and digital PDFs with our advanced OCR technology.',
    faq2Q: 'Are the translations accepted by USCIS and other government agencies?',
    faq2A: 'Yes! All translations completed through EZDocu include a Certificate of Translation Accuracy that meets USCIS requirements. Our certified translations are accepted by immigration offices, courts, universities, and government agencies worldwide.',
    faq3Q: 'How does the AI translation work?',
    faq3A: 'Our AI uses advanced language models trained specifically on legal and official document terminology. It provides accurate initial translations that certified translators can then review and finalize. This hybrid approach ensures both speed and accuracy.',
    faq4Q: 'How long does it take to get a certified translation?',
    faq4A: 'Most single-page documents are completed within 24 hours. Complex multi-page documents may take 2-3 business days. We also offer rush processing for urgent requests at an additional fee.',
    faq5Q: 'Can I edit the translation before finalizing?',
    faq5A: 'Absolutely! EZDocu provides a side-by-side editor where you can review the AI-generated translation, make adjustments, and ensure everything is perfect before generating the certified document.',
    faq6Q: 'What\'s included in the free plan?',
    faq6A: 'The free plan includes 5 pages per month, basic OCR extraction, AI translation assistance, community support, and basic certification. It\'s perfect for individuals with occasional translation needs.',
    faq7Q: 'Is my data secure?',
    faq7A: 'Yes, security is our top priority. All documents are encrypted in transit and at rest. We\'re SOC 2 certified and HIPAA compliant. Your documents are automatically deleted after 30 days, or you can delete them immediately after download.',
    faq8Q: 'Do you offer team or enterprise plans?',
    faq8A: 'Yes! Our Business plan includes unlimited pages, team workspaces for up to 5 users, dedicated account management, API access, and custom integrations. Contact our sales team for enterprise pricing with additional features.',
    footerDesc: 'Professional document translation platform for certified translators.',
    product: 'Product',
    resources: 'Resources',
    company: 'Company',
    blog: 'Blog',
    support: 'Support',
    apiDocs: 'API Docs',
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    year: 'year',
    month: 'month',
    pagesPerMonth: '5 pages per month',
    basicOcr: 'Basic OCR extraction',
    aiTranslation: 'AI translation',
    communitySupport: 'Community support',
    basicCertificates: 'Basic certificates',
    proPages: '100 pages per month',
    advancedOcr: 'Advanced OCR extraction',
    aiTranslationEdit: 'AI translation + editing',
    prioritySupport: 'Priority support',
    customCertificates: 'Custom certificates',
    auditTrail: 'Audit trail',
    unlimitedPages: 'Unlimited pages',
    premiumOcr: 'Premium OCR extraction',
    teamWorkspace: 'Team workspace (5 users)',
    dedicatedManager: 'Dedicated manager',
    apiAccess: 'API access',
    smartOcr: 'Smart OCR',
    smartOcrDesc: 'Extract text from any document with 99.9% accuracy.',
    aiTranslationTitle: 'AI Translation',
    aiTranslationDesc: 'Context-aware translations that understand legal terminology.',
    teamWorkspaceTitle: 'Team Workspace',
    teamWorkspaceDesc: 'Invite team members and track progress in real-time.',
    legalCertificates: 'Legal Certificates',
    legalCertificatesDesc: 'Auto-generate certified translation certificates.',
    learnMore: 'Learn more',
    uploadDocument: 'Upload Document',
    dropFiles: 'Drop your files here',
    searchDocuments: 'Search documents...',
    birthCertificate: 'Birth Certificate',
    marriageLicense: 'Marriage License',
    diploma: 'Diploma',
    passport: 'Passport',
    legalContract: 'Legal Contract',
    certificateOfTranslation: 'Certificate of Translation',
    certifiedTranslation: 'Certified Translation',
    creditsIncluded: 'credits included',
    perMonth: '/month',
    perYear: '/year',
  },
  es: {
    features: 'Características',
    howItWorks: 'Cómo funciona',
    pricing: 'Precios',
    faq: 'Preguntas frecuentes',
    login: 'Acceso',
    getStarted: 'Empezar',
    heroTitle: 'Traducir documentos con',
    heroTitleHighlight: 'precisión legal',
    heroDesc: 'Plataforma profesional de OCR y traducción para traductores certificados.',
    heroDesc2: 'Control total, registros de auditoría y cumplimiento legal integrados.',
    startTrial: 'Comience una prueba gratuita',
    seeHow: 'Vea cómo funciona',
    badge: 'Traducción de documentos impulsada por IA',
    trusted: 'Confiado por traductores certificados en todo el mundo',
    uscis: 'Compatible con USCIS',
    ata: 'Soporte Certificado ATA',
    soc2: 'Seguridad SOC 2',
    hipaa: 'Listo para HIPAA',
    featuresTitle: 'Todo lo que necesitas para traducción profesional',
    featuresDesc: 'Diseñado específicamente para traductores certificados y profesionales legales',
    processTitle: 'Cuatro simples pasos para traducciones certificadas',
    processDesc: 'Sigue estos simples pasos para traducir, certificar y entregar tus documentos.',
    step1: 'Subir documento',
    step1Desc: 'Sube tu PDF, imagen o documento Word. Soportamos más de 50 formatos incluyendo documentos escaneados, fotos y archivos digitales.',
    step2: 'Revisar OCR',
    step2Desc: 'Verifica que el texto extraído sea preciso con nuestro motor OCR impulsado por IA. Haz correcciones si es necesario antes de traducir.',
    step3: 'Traducir y editar',
    step3Desc: 'Edita y aprueba la traducción generada por IA con control total. El editor lado a lado te permite perfeccionar cada detalle.',
    step4: 'Exportar y certificar',
    step4Desc: 'Descarga tu traducción con certificado adjunto. Listo para USCIS, tribunales y presentaciones oficiales.',
    pricingTitle: 'Elige un plan que funcione para ti',
    pricingDesc: 'Comienza con EZDocu hoy y disfruta de más funciones con nuestros planes pro.',
    monthly: 'Mensual',
    yearly: 'Anual',
    free: 'Gratis',
    forIndividuals: 'Para la mayoría de individuos',
    pro: 'Pro',
    forSmall: 'Para pequeñas empresas',
    business: 'Empresarial',
    forLarge: 'Para grandes organizaciones',
    mostPopular: 'Más Popular',
    startFree: 'Comenzar gratis',
    contactTeam: 'Contactar equipo',
    noCard: 'No se requiere tarjeta de crédito para el plan gratuito',
    trustedWorldwide: 'Confianza',
    worldwide: 'Mundial',
    ctaDesc: 'Únete a miles de traductores certificados que ahorran horas cada semana con EZDocu.',
    startYourTrial: 'Comienza tu prueba gratuita',
    stillQuestions: '¿Aún tienes preguntas?',
    contactSupport: 'Contactar Soporte',
    faq1Q: '¿Qué tipos de documentos puede traducir EZDocu?',
    faq1A: 'EZDocu soporta todos los tipos de documentos comunes incluyendo actas de nacimiento, actas de matrimonio, diplomas, transcripciones, pasaportes, licencias de conducir, contratos legales y más. Manejamos tanto imágenes escaneadas como PDFs digitales con nuestra tecnología OCR avanzada.',
    faq2Q: '¿Las traducciones son aceptadas por USCIS y otras agencias gubernamentales?',
    faq2A: '¡Sí! Todas las traducciones completadas a través de EZDocu incluyen un Certificado de Precisión de Traducción que cumple con los requisitos de USCIS. Nuestras traducciones certificadas son aceptadas por oficinas de inmigración, tribunales, universidades y agencias gubernamentales en todo el mundo.',
    faq3Q: '¿Cómo funciona la traducción con IA?',
    faq3A: 'Nuestra IA utiliza modelos de lenguaje avanzados entrenados específicamente en terminología legal y de documentos oficiales. Proporciona traducciones iniciales precisas que los traductores certificados pueden revisar y finalizar. Este enfoque híbrido garantiza velocidad y precisión.',
    faq4Q: '¿Cuánto tiempo toma obtener una traducción certificada?',
    faq4A: 'La mayoría de los documentos de una página se completan en 24 horas. Los documentos complejos de varias páginas pueden tomar 2-3 días hábiles. También ofrecemos procesamiento urgente para solicitudes urgentes con una tarifa adicional.',
    faq5Q: '¿Puedo editar la traducción antes de finalizarla?',
    faq5A: '¡Por supuesto! EZDocu proporciona un editor lado a lado donde puedes revisar la traducción generada por IA, hacer ajustes y asegurar que todo esté perfecto antes de generar el documento certificado.',
    faq6Q: '¿Qué incluye el plan gratuito?',
    faq6A: 'El plan gratuito incluye 5 páginas por mes, extracción OCR básica, asistencia de traducción con IA, soporte comunitario y certificación básica. Es perfecto para individuos con necesidades ocasionales de traducción.',
    faq7Q: '¿Mis datos están seguros?',
    faq7A: 'Sí, la seguridad es nuestra principal prioridad. Todos los documentos están encriptados en tránsito y en reposo. Tenemos certificación SOC 2 y cumplimos con HIPAA. Tus documentos se eliminan automáticamente después de 30 días, o puedes eliminarlos inmediatamente después de descargarlos.',
    faq8Q: '¿Ofrecen planes de equipo o empresariales?',
    faq8A: '¡Sí! Nuestro plan Business incluye páginas ilimitadas, espacios de trabajo en equipo para hasta 5 usuarios, gestión de cuenta dedicada, acceso API e integraciones personalizadas. Contacta a nuestro equipo de ventas para precios empresariales con características adicionales.',
    footerDesc: 'Plataforma profesional de traducción de documentos para traductores certificados.',
    product: 'Producto',
    resources: 'Recursos',
    company: 'Empresa',
    blog: 'Blog',
    support: 'Soporte',
    apiDocs: 'Documentación API',
    aboutUs: 'Sobre Nosotros',
    privacyPolicy: 'Política de Privacidad',
    termsConditions: 'Términos y Condiciones',
    year: 'año',
    month: 'mes',
    pagesPerMonth: '5 páginas por mes',
    basicOcr: 'Extracción OCR básica',
    aiTranslation: 'Traducción con IA',
    communitySupport: 'Soporte comunitario',
    basicCertificates: 'Certificados básicos',
    proPages: '100 páginas por mes',
    advancedOcr: 'Extracción OCR avanzada',
    aiTranslationEdit: 'Traducción con IA + edición',
    prioritySupport: 'Soporte prioritario',
    customCertificates: 'Certificados personalizados',
    auditTrail: 'Historial de auditoría',
    unlimitedPages: 'Páginas ilimitadas',
    premiumOcr: 'Extracción OCR premium',
    teamWorkspace: 'Espacio de equipo (5 usuarios)',
    dedicatedManager: 'Gerente dedicado',
    apiAccess: 'Acceso API',
    smartOcr: 'OCR Inteligente',
    smartOcrDesc: 'Extrae texto de cualquier documento con 99.9% de precisión.',
    aiTranslationTitle: 'Traducción con IA',
    aiTranslationDesc: 'Traducciones contextuales que entienden terminología legal.',
    teamWorkspaceTitle: 'Espacio de Equipo',
    teamWorkspaceDesc: 'Invita miembros del equipo y sigue el progreso en tiempo real.',
    legalCertificates: 'Certificados Legales',
    legalCertificatesDesc: 'Genera automáticamente certificados de traducción certificada.',
    learnMore: 'Más información',
    uploadDocument: 'Subir Documento',
    dropFiles: 'Suelta tus archivos aquí',
    searchDocuments: 'Buscar documentos...',
    birthCertificate: 'Acta de Nacimiento',
    marriageLicense: 'Acta de Matrimonio',
    diploma: 'Diploma',
    passport: 'Pasaporte',
    legalContract: 'Contrato Legal',
    certificateOfTranslation: 'Certificado de Traducción',
    certifiedTranslation: 'Traducción Certificada',
    creditsIncluded: 'créditos incluidos',
    perMonth: '/mes',
    perYear: '/año',
  },
  pt: {
    features: 'Recursos',
    howItWorks: 'Como funciona',
    pricing: 'Preços',
    faq: 'Perguntas frequentes',
    login: 'Entrar',
    getStarted: 'Começar',
    heroTitle: 'Traduzir documentos com',
    heroTitleHighlight: 'precisão legal',
    heroDesc: 'Plataforma profissional de OCR e tradução para tradutores certificados.',
    heroDesc2: 'Controle total, trilhas de auditoria e conformidade legal integrados.',
    startTrial: 'Iniciar teste gratuito',
    seeHow: 'Veja como funciona',
    badge: 'Tradução de documentos com IA',
    trusted: 'Confiado por tradutores certificados em todo o mundo',
    uscis: 'Compatível com USCIS',
    ata: 'Suporte Certificado ATA',
    soc2: 'Segurança SOC 2',
    hipaa: 'Pronto para HIPAA',
    featuresTitle: 'Tudo o que você precisa para tradução profissional',
    featuresDesc: 'Construído especificamente para tradutores certificados e profissionais jurídicos',
    processTitle: 'Quatro passos simples para traduções certificadas',
    processDesc: 'Siga estes passos simples para traduzir, certificar e entregar seus documentos.',
    step1: 'Enviar documento',
    step1Desc: 'Envie seu PDF, imagem ou documento Word. Suportamos mais de 50 formatos incluindo documentos digitalizados, fotos e arquivos digitais.',
    step2: 'Revisar OCR',
    step2Desc: 'Verifique se o texto extraído está preciso com nosso motor OCR com IA. Faça correções se necessário antes de traduzir.',
    step3: 'Traduzir e editar',
    step3Desc: 'Edite e aprove a tradução gerada por IA com controle total. O editor lado a lado permite aperfeiçoar cada detalhe.',
    step4: 'Exportar e certificar',
    step4Desc: 'Baixe sua tradução com certificado anexado. Pronto para USCIS, tribunais e submissões oficiais.',
    pricingTitle: 'Escolha um plano que funcione para você',
    pricingDesc: 'Comece com EZDocu hoje e aproveite mais recursos com nossos planos pro.',
    monthly: 'Mensal',
    yearly: 'Anual',
    free: 'Grátis',
    forIndividuals: 'Para a maioria dos indivíduos',
    pro: 'Pro',
    forSmall: 'Para pequenas empresas',
    business: 'Empresarial',
    forLarge: 'Para grandes organizações',
    mostPopular: 'Mais Popular',
    startFree: 'Começar grátis',
    contactTeam: 'Contatar equipe',
    noCard: 'Não é necessário cartão de crédito para o plano gratuito',
    trustedWorldwide: 'Confiança',
    worldwide: 'Mundial',
    ctaDesc: 'Junte-se a milhares de tradutores certificados que economizam horas toda semana com EZDocu.',
    startYourTrial: 'Comece seu teste gratuito',
    stillQuestions: 'Ainda tem perguntas?',
    contactSupport: 'Contatar Suporte',
    faq1Q: 'Que tipos de documentos o EZDocu pode traduzir?',
    faq1A: 'O EZDocu suporta todos os tipos comuns de documentos, incluindo certidões de nascimento, certidões de casamento, diplomas, históricos escolares, passaportes, carteiras de motorista, contratos legais e muito mais. Processamos tanto imagens digitalizadas quanto PDFs digitais com nossa tecnologia OCR avançada.',
    faq2Q: 'As traduções são aceitas pelo USCIS e outras agências governamentais?',
    faq2A: 'Sim! Todas as traduções concluídas através do EZDocu incluem um Certificado de Precisão de Tradução que atende aos requisitos do USCIS. Nossas traduções certificadas são aceitas por escritórios de imigração, tribunais, universidades e agências governamentais em todo o mundo.',
    faq3Q: 'Como funciona a tradução com IA?',
    faq3A: 'Nossa IA usa modelos de linguagem avançados treinados especificamente em terminologia legal e de documentos oficiais. Ela fornece traduções iniciais precisas que tradutores certificados podem revisar e finalizar. Essa abordagem híbrida garante velocidade e precisão.',
    faq4Q: 'Quanto tempo leva para obter uma tradução certificada?',
    faq4A: 'A maioria dos documentos de uma página é concluída em 24 horas. Documentos complexos de várias páginas podem levar 2-3 dias úteis. Também oferecemos processamento urgente para solicitações urgentes com uma taxa adicional.',
    faq5Q: 'Posso editar a tradução antes de finalizar?',
    faq5A: 'Com certeza! O EZDocu fornece um editor lado a lado onde você pode revisar a tradução gerada por IA, fazer ajustes e garantir que tudo esteja perfeito antes de gerar o documento certificado.',
    faq6Q: 'O que está incluído no plano gratuito?',
    faq6A: 'O plano gratuito inclui 5 páginas por mês, extração OCR básica, assistência de tradução com IA, suporte da comunidade e certificação básica. É perfeito para indivíduos com necessidades ocasionais de tradução.',
    faq7Q: 'Meus dados estão seguros?',
    faq7A: 'Sim, a segurança é nossa principal prioridade. Todos os documentos são criptografados em trânsito e em repouso. Temos certificação SOC 2 e conformidade com HIPAA. Seus documentos são automaticamente excluídos após 30 dias, ou você pode excluí-los imediatamente após o download.',
    faq8Q: 'Vocês oferecem planos para equipes ou empresas?',
    faq8A: 'Sim! Nosso plano Business inclui páginas ilimitadas, espaços de trabalho em equipe para até 5 usuários, gerenciamento de conta dedicado, acesso à API e integrações personalizadas. Entre em contato com nossa equipe de vendas para preços empresariais com recursos adicionais.',
    footerDesc: 'Plataforma profissional de tradução de documentos para tradutores certificados.',
    product: 'Produto',
    resources: 'Recursos',
    company: 'Empresa',
    blog: 'Blog',
    support: 'Suporte',
    apiDocs: 'Documentação API',
    aboutUs: 'Sobre Nós',
    privacyPolicy: 'Política de Privacidade',
    termsConditions: 'Termos e Condições',
    year: 'ano',
    month: 'mês',
    pagesPerMonth: '5 páginas por mês',
    basicOcr: 'Extração OCR básica',
    aiTranslation: 'Tradução com IA',
    communitySupport: 'Suporte da comunidade',
    basicCertificates: 'Certificados básicos',
    proPages: '100 páginas por mês',
    advancedOcr: 'Extração OCR avançada',
    aiTranslationEdit: 'Tradução com IA + edição',
    prioritySupport: 'Suporte prioritário',
    customCertificates: 'Certificados personalizados',
    auditTrail: 'Trilha de auditoria',
    unlimitedPages: 'Páginas ilimitadas',
    premiumOcr: 'Extração OCR premium',
    teamWorkspace: 'Espaço de equipe (5 usuários)',
    dedicatedManager: 'Gerente dedicado',
    apiAccess: 'Acesso à API',
    smartOcr: 'OCR Inteligente',
    smartOcrDesc: 'Extraia texto de qualquer documento com 99.9% de precisão.',
    aiTranslationTitle: 'Tradução com IA',
    aiTranslationDesc: 'Traduções contextuais que entendem terminologia legal.',
    teamWorkspaceTitle: 'Espaço de Equipe',
    teamWorkspaceDesc: 'Convide membros da equipe e acompanhe o progresso em tempo real.',
    legalCertificates: 'Certificados Legais',
    legalCertificatesDesc: 'Gere automaticamente certificados de tradução certificada.',
    learnMore: 'Saiba mais',
    uploadDocument: 'Enviar Documento',
    dropFiles: 'Solte seus arquivos aqui',
    searchDocuments: 'Pesquisar documentos...',
    birthCertificate: 'Certidão de Nascimento',
    marriageLicense: 'Certidão de Casamento',
    diploma: 'Diploma',
    passport: 'Passaporte',
    legalContract: 'Contrato Legal',
    certificateOfTranslation: 'Certificado de Tradução',
    certifiedTranslation: 'Tradução Certificada',
    creditsIncluded: 'créditos incluídos',
    perMonth: '/mês',
    perYear: '/ano',
  },
};

const langNames: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
};

const langFlags: Record<Lang, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  pt: '🇧🇷',
};

// Lazy load heavy components that use framer-motion
const BorderBeam = dynamic(() => import('@/components/ui/border-beam').then(m => ({ default: m.BorderBeam })), { ssr: false });
const TextHoverEffect = dynamic(() => import('@/components/ui/text-hover-effect').then(m => ({ default: m.TextHoverEffect })), { ssr: false });
const BentoGrid = dynamic(() => import('@/components/ui/bento-grid').then(m => ({ default: m.BentoGrid })), { ssr: false });
const BentoCard = dynamic(() => import('@/components/ui/bento-grid').then(m => ({ default: m.BentoCard })), { ssr: false });
const WorldMap = dynamic(() => import('@/components/ui/world-map'), { ssr: false });
const Timeline = dynamic(() => import('@/components/ui/timeline').then(m => ({ default: m.Timeline })), { ssr: false });

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
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  HelpCircle,
  Menu,
  X,
  Coins
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

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyDiscount: number;
  benefits: string[];
  pagesPerMonth: number | null;
  creditsMonthly: number | null;
  creditsYearly: number | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  buttonText: string;
  buttonVariant: string;
}

export default function Home() {
  const [isYearly, setIsYearly] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planStartIndex, setPlanStartIndex] = useState(0);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language?.split('-')[0] || 'en';
    if (browserLang === 'es' || browserLang === 'pt') {
      setLang(browserLang as Lang);
    }
    // Check localStorage
    const saved = localStorage.getItem('lang') as Lang;
    if (saved && ['en', 'es', 'pt'].includes(saved)) {
      setLang(saved);
    }

    // Fetch plans from backend
    fetch('/api/payments/plans')
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && data.plans) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.error('Error fetching plans:', err));
  }, []);

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    setLangMenuOpen(false);
  };

  const t = translations[lang];

  // Fallback prices if plans haven't loaded
  const fallbackPrices = {
    pro: { monthly: 29, yearly: 255 },
    business: { monthly: 99, yearly: 871 }
  };

  const getPlanPrice = (slug: string, yearly: boolean) => {
    const plan = plans.find(p => p.slug === slug);
    if (plan) {
      return yearly ? Math.round(parseFloat(plan.yearlyPrice)) : Math.round(parseFloat(plan.monthlyPrice));
    }
    if (slug === 'pro') return yearly ? fallbackPrices.pro.yearly : fallbackPrices.pro.monthly;
    if (slug === 'business') return yearly ? fallbackPrices.business.yearly : fallbackPrices.business.monthly;
    return 0;
  };

  const getPlanDiscount = (slug: string) => {
    const plan = plans.find(p => p.slug === slug);
    return plan?.yearlyDiscount || 12;
  };

  const getPlanBenefits = (slug: string) => {
    const plan = plans.find(p => p.slug === slug);
    return plan?.benefits || [];
  };

  const getPlanButton = (slug: string) => {
    const plan = plans.find(p => p.slug === slug);
    return {
      text: plan?.buttonText || 'Get started',
      variant: plan?.buttonVariant || 'default'
    };
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
          <div className="bg-purple-100 rounded-2xl px-6 overflow-visible">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={36} height={36} className="h-9 w-9" />
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
                  {t.features}
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
                  {t.howItWorks}
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
                  {t.pricing}
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
                  {t.faq}
                </button>

                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 bg-white hover:bg-gray-50 rounded-lg ml-2">
                    {t.login}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4">
                    {t.getStarted}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer text-sm text-gray-700"
                  >
                    <span>{langFlags[lang]}</span>
                    <span>{langNames[lang]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[100px] z-[200]">
                      {(['en', 'es', 'pt'] as Lang[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => handleLangChange(l)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-purple-50 transition-colors cursor-pointer ${lang === l ? 'bg-purple-50 text-purple-600' : 'text-gray-700'}`}
                        >
                          <span>{langFlags[l]}</span>
                          <span>{langNames[l]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
              {t.features}
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
              {t.howItWorks}
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
              {t.pricing}
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
              {t.faq}
            </button>
          </nav>

          {/* Language Selector for Mobile */}
          <div className="py-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              {(['en', 'es', 'pt'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    lang === l ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{langFlags[l]}</span>
                  <span>{langNames[l]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 pt-4 border-t border-white/20">
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl h-11">
                {t.login}
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full bg-white hover:bg-gray-100 text-purple-900 rounded-xl h-11 font-semibold">
                {t.getStarted}
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
                    {t.badge}
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </span>
                </button>

                <h1 className="text-gray-900 text-center py-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance !leading-[1.1] w-full">
                  {t.heroTitle}{' '}
                  <span className="text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">
                    {t.heroTitleHighlight}
                  </span>
                </h1>

                <p className="mb-10 text-lg tracking-tight text-gray-600 md:text-xl text-balance max-w-2xl">
                  {t.heroDesc}
                  <br className="hidden md:block" />
                  <span className="hidden md:block">
                    {t.heroDesc2}
                  </span>
                </p>

                <div className="flex items-center justify-center whitespace-nowrap gap-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 h-12">
                      {t.startTrial}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-gray-200 bg-white">
                      {t.seeHow}
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
              {t.trusted}
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{t.uscis}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{t.ata}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{t.soc2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{t.hipaa}</span>
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
              <MagicBadge title={t.features} />
              <h2 className="text-center text-2xl md:text-4xl !leading-[1.1] font-bold text-gray-900 mt-4">
                {t.featuresTitle}
              </h2>
              <p className="mt-3 text-center text-base text-gray-600 max-w-lg">
                {t.featuresDesc}
              </p>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2}>
            <BentoGrid className="py-2">
              {/* Smart OCR Card */}
              <BentoCard
                name={t.smartOcr}
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute top-10 left-10 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105 border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-gray-900 mb-2">{t.uploadDocument}</div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">{t.dropFiles}</span>
                    </div>
                  </div>
                }
                Icon={FileText}
                description={t.smartOcrDesc}
                href="#"
                cta={t.learnMore}
              />

              {/* AI Translation Card */}
              <BentoCard
                name={t.aiTranslationTitle}
                className="col-span-3 lg:col-span-2"
                background={
                  <div className="absolute right-10 top-10 w-[70%] border border-gray-200 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-4 rounded-lg bg-white shadow-sm">
                    <Input placeholder={t.searchDocuments} className="mb-3" />
                    <div className="cursor-pointer text-sm">
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">{t.birthCertificate}</span>
                        <span className="text-purple-600">ES → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">{t.marriageLicense}</span>
                        <span className="text-purple-600">FR → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">{t.diploma}</span>
                        <span className="text-purple-600">DE → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">{t.passport}</span>
                        <span className="text-purple-600">PT → EN</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 rounded flex justify-between">
                        <span className="text-gray-600">{t.legalContract}</span>
                        <span className="text-purple-600">IT → EN</span>
                      </div>
                    </div>
                  </div>
                }
                Icon={Languages}
                description={t.aiTranslationDesc}
                href="#"
                cta={t.learnMore}
              />

              {/* Team Workspace Card */}
              <BentoCard
                name={t.teamWorkspaceTitle}
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
                description={t.teamWorkspaceDesc}
                href="#"
                cta={t.learnMore}
              />

              {/* Legal Certificates Card */}
              <BentoCard
                name={t.legalCertificates}
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute right-0 top-10 origin-top rounded-md border border-gray-200 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105 bg-white p-4 shadow-sm">
                    <div className="w-44 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="text-xs font-semibold text-gray-700">{t.certificateOfTranslation}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">{t.certifiedTranslation}</span>
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                }
                Icon={Shield}
                description={t.legalCertificatesDesc}
                href="#"
                cta={t.learnMore}
              />
            </BentoGrid>
          </AnimationContainer>
        </div>
      </section>

      {/* Process Section - Timeline Style */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-center justify-center w-full py-4 max-w-xl mx-auto mb-10">
              <MagicBadge title={t.howItWorks} />
              <h2 className="text-center text-3xl md:text-5xl !leading-[1.1] font-bold text-gray-900 mt-6">
                {t.processTitle}
              </h2>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-lg">
                {t.processDesc}
              </p>
            </div>
          </AnimationContainer>

          <div className="relative w-full overflow-clip">
            <Timeline data={[
              {
                title: t.step1,
                content: (
                  <div>
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                      {t.step1Desc}
                    </p>
                    {/* Video placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl overflow-hidden relative shadow-2xl">
                      <video
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/videos/step-1.mp4" type="video/mp4" />
                      </video>
                      {/* Fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="w-20 h-20 text-white/40" />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: t.step2,
                content: (
                  <div>
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                      {t.step2Desc}
                    </p>
                    {/* Video placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl overflow-hidden relative shadow-2xl">
                      <video
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/videos/step-2.mp4" type="video/mp4" />
                      </video>
                      {/* Fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="w-20 h-20 text-white/40" />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: t.step3,
                content: (
                  <div>
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                      {t.step3Desc}
                    </p>
                    {/* Video placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl overflow-hidden relative shadow-2xl">
                      <video
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/videos/step-3.mp4" type="video/mp4" />
                      </video>
                      {/* Fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Edit3 className="w-20 h-20 text-white/40" />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: t.step4,
                content: (
                  <div>
                    <p className="text-gray-600 text-sm md:text-base mb-6">
                      {t.step4Desc}
                    </p>
                    {/* Video placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl overflow-hidden relative shadow-2xl">
                      <video
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/videos/step-4.mp4" type="video/mp4" />
                      </video>
                      {/* Fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Download className="w-20 h-20 text-white/40" />
                      </div>
                    </div>
                  </div>
                ),
              },
            ]} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-6 px-4 bg-gradient-to-b from-white via-purple-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-center justify-center w-full py-2 max-w-xl mx-auto">
              <MagicBadge title={t.pricing} />
              <h2 className="text-center text-3xl md:text-5xl !leading-[1.1] font-bold text-gray-900 mt-6">
                {t.pricingTitle}
              </h2>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-lg">
                {t.pricingDesc}
              </p>

              {/* Monthly/Yearly Toggle */}
              <div className="flex items-center gap-1 mt-8 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    !isYearly
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.monthly}
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                    isYearly
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.yearly}
                </button>
              </div>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.2}>
            {(() => {
              const allPlans = plans.length > 0 ? plans : [
                { id: 1, slug: 'free', name: 'Free', description: t.forIndividuals, monthlyPrice: '0', yearlyPrice: '0', yearlyDiscount: 0, benefits: [t.pagesPerMonth, t.basicOcr, t.aiTranslation, t.communitySupport, t.basicCertificates], isPopular: false, buttonText: t.startFree, buttonVariant: 'outline' },
                { id: 2, slug: 'pro', name: 'Pro', description: t.forSmall, monthlyPrice: '29', yearlyPrice: '255', yearlyDiscount: 12, benefits: [t.proPages, t.advancedOcr, t.aiTranslationEdit, t.prioritySupport, t.customCertificates, t.auditTrail], isPopular: true, buttonText: t.getStarted, buttonVariant: 'primary' },
                { id: 3, slug: 'business', name: 'Business', description: t.forLarge, monthlyPrice: '99', yearlyPrice: '871', yearlyDiscount: 12, benefits: [t.unlimitedPages, t.premiumOcr, t.aiTranslationEdit, t.teamWorkspace, t.dedicatedManager, t.apiAccess], isPopular: false, buttonText: t.contactTeam, buttonVariant: 'outline' },
              ] as Plan[];
              const visiblePlans = allPlans.slice(planStartIndex, planStartIndex + 3);
              const canGoLeft = planStartIndex > 0;
              const canGoRight = planStartIndex + 3 < allPlans.length;

              return (
                <div className="relative py-4">
                  {/* Left Arrow */}
                  {canGoLeft && (
                    <button
                      onClick={() => setPlanStartIndex(Math.max(0, planStartIndex - 1))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {canGoRight && (
                    <button
                      onClick={() => setPlanStartIndex(Math.min(allPlans.length - 3, planStartIndex + 1))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  )}

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Dynamic Plans from Database */}
                    {visiblePlans.map((plan) => {
                      const price = isYearly ? Math.round(parseFloat(plan.yearlyPrice)) : Math.round(parseFloat(plan.monthlyPrice));
                      const isPopular = plan.isPopular;
                      const isPrimary = plan.buttonVariant === 'primary';
                      const displayCredits = isYearly
                        ? (plan.creditsYearly || 0)
                        : (plan.creditsMonthly || plan.pagesPerMonth || 0);

                      return (
                        <div
                          key={plan.id}
                          className={`relative rounded-2xl ${
                            isPopular ? 'border-2 border-purple-500' : 'border border-gray-200'
                          } bg-white p-6 transition-all ${
                            isPopular ? 'hover:shadow-xl' : 'hover:shadow-lg hover:border-gray-300'
                          } flex flex-col h-full`}
                        >
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                {t.mostPopular}
                              </span>
                            </div>
                          )}
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                          </div>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-bold text-gray-900">${price}</span>
                            {price > 0 && (
                              <>
                                <span className="text-gray-500 text-lg">/{isYearly ? t.year : t.month}</span>
                                {isYearly && plan.yearlyDiscount > 0 && (
                                  <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                                    -{plan.yearlyDiscount}%
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          {/* Credits badge */}
                          {displayCredits > 0 && (
                            <div className="bg-purple-50 rounded-lg px-3 py-2 mb-6">
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-purple-700">
                                  {displayCredits.toLocaleString()} {t.creditsIncluded}
                                </span>
                                <span className="text-xs text-purple-500">
                                  {isYearly ? t.perYear : t.perMonth}
                                </span>
                              </div>
                            </div>
                          )}
                          <ul className="space-y-4 text-sm text-gray-600 flex-1">
                            {plan.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                          <Link href="/sign-up" className="mt-8">
                            <Button
                              variant={isPrimary ? 'default' : 'outline'}
                              className={`w-full h-11 rounded-lg ${
                                isPrimary
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                  : 'border-gray-200'
                              }`}
                            >
                              {plan.buttonText}
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dots indicator */}
                  {allPlans.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      {Array.from({ length: allPlans.length - 2 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPlanStartIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                            planStartIndex === idx ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </AnimationContainer>

          <AnimationContainer delay={0.3}>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-5 h-5" />
                <span>{t.noCard}</span>
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
                { question: t.faq1Q, answer: t.faq1A },
                { question: t.faq2Q, answer: t.faq2A },
                { question: t.faq3Q, answer: t.faq3A },
                { question: t.faq4Q, answer: t.faq4A },
                { question: t.faq5Q, answer: t.faq5A },
                { question: t.faq6Q, answer: t.faq6A },
                { question: t.faq7Q, answer: t.faq7A },
                { question: t.faq8Q, answer: t.faq8A },
              ].map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} index={index} />
              ))}
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">{t.stillQuestions}</p>
              <Link href="mailto:support@ezdocu.com">
                <Button variant="outline" className="rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t.contactSupport}
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

        {/* World Map as Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90%] md:w-[80%] max-w-5xl h-full">
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
                  {t.trustedWorldwide}{" "}
                  <span className="text-purple-200">{t.worldwide}</span>
                </h2>
                <p className="text-purple-100 max-w-md mx-auto text-lg mb-6">
                  {t.ctaDesc}
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-purple-900 rounded-full px-8 h-12 font-semibold shadow-lg">
                    {t.startYourTrial}
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
                {t.footerDesc}
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">{t.product}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900 transition-colors">{t.features}</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">{t.pricing}</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gray-900 transition-colors">{t.howItWorks}</Link></li>
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">{t.resources}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.blog}</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.support}</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.apiDocs}</a></li>
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">{t.company}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.aboutUs}</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.privacyPolicy}</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">{t.termsConditions}</a></li>
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
