'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Languages,
  FileType,
  Info,
  ScanLine,
  UserPlus,
  Users
} from 'lucide-react';
import Link from 'next/link';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import ComparisonView, { ProcessedPage, StyledBlock } from '@/components/processing/ComparisonView';

// Dynamic import for pdf.js to avoid SSR issues
const loadPdfJs = async () => {
  const pdfjs = await import('pdfjs-dist');
  // Use local worker file from public folder for reliability
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  return pdfjs;
};

// Dynamic import for mammoth
const loadMammoth = async () => {
  const mammoth = await import('mammoth');
  return mammoth.default || mammoth;
};

type DocType = 'image' | 'text';
type DocumentCategory = 'birth_certificate' | 'diploma' | 'passport' | 'marriage_license' | 'medical' | 'legal' | 'immigration' | 'other';

interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  detectedType: 'pdf' | 'image' | 'word';
  hasSelectableText?: boolean; // For PDFs - detected via analysis
  detectedPages?: number; // Auto-detected page count
  textContent?: string; // Sample of extracted text
  isAnalyzing?: boolean; // Loading state for file analysis
}

interface AnalysisResult {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  totalPages: number;
  documentType: DocType;
  creditsPerPage: number;
  creditsRequired: number;
  accountCredits: number;
  hasEnoughCredits: boolean;
  creditShortfall: number;
}

interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
];

const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'diploma', label: 'Diploma / Degree' },
  { value: 'passport', label: 'Passport' },
  { value: 'marriage_license', label: 'Marriage License' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'legal', label: 'Legal Document' },
  { value: 'immigration', label: 'Immigration Form' },
  { value: 'other', label: 'Other' },
];

// PDF Preview Component that renders to canvas
function PdfPreview({ file }: { file: File }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      if (!canvasRef.current) return;

      try {
        setIsRendering(true);
        setError(false);

        const pdfjs = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        if (cancelled) return;

        // Scale to fit the container (128px width)
        const desiredWidth = 128;
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          setError(true);
          return;
        }

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        } as any).promise;

        setIsRendering(false);
      } catch (err) {
        console.error('PDF render error:', err);
        if (!cancelled) {
          setError(true);
          setIsRendering(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
          <FileText className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-xs text-red-600 mt-2 font-medium">PDF</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain ${isRendering ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 0.2s' }}
      />
    </div>
  );
}

// Large PDF Preview Component for the document viewer with page navigation
// Now accepts optional pdfDoc to avoid reloading
function LargePdfPreview({
  file,
  totalPages,
  onPageChange,
  pdfDoc,
  onPdfLoaded
}: {
  file: File;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pdfDoc?: PDFDocumentProxy | null;
  onPdfLoaded?: (pdf: PDFDocumentProxy) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(totalPages || 1);
  const [pdfLoaded, setPdfLoaded] = useState(!!pdfDoc);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(pdfDoc || null);

  // Use provided pdfDoc if available
  useEffect(() => {
    if (pdfDoc) {
      pdfDocRef.current = pdfDoc;
      setNumPages(pdfDoc.numPages);
      setPdfLoaded(true);
    }
  }, [pdfDoc]);

  // Load PDF document once (only if not provided)
  useEffect(() => {
    if (pdfDoc) return; // Skip loading if already provided

    let cancelled = false;

    const loadPdf = async () => {
      try {
        setPdfLoaded(false);
        const pdfjs = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        if (cancelled) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setPdfLoaded(true);

        // Notify parent about loaded PDF for caching
        onPdfLoaded?.(pdf);
      } catch (err) {
        console.error('PDF load error:', err);
        if (!cancelled) {
          setError(true);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file, pdfDoc, onPdfLoaded]);

  // Render current page when PDF is loaded or page changes
  useEffect(() => {
    let cancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current || !containerRef.current || !pdfDocRef.current || !pdfLoaded) return;

      try {
        setIsRendering(true);
        setError(false);

        const page = await pdfDocRef.current.getPage(currentPage);

        if (cancelled) return;

        // Get container dimensions
        const containerWidth = containerRef.current.clientWidth - 32; // padding
        const containerHeight = containerRef.current.clientHeight - 80; // space for nav buttons

        // Calculate scale to fit container while maintaining aspect ratio
        const viewport = page.getViewport({ scale: 1 });
        const scaleX = containerWidth / viewport.width;
        const scaleY = containerHeight / viewport.height;
        const scale = Math.min(scaleX, scaleY, 3); // Max scale of 3 for better quality

        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          setError(true);
          return;
        }

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        } as any).promise;

        setIsRendering(false);
      } catch (err) {
        console.error('PDF render error:', err);
        if (!cancelled) {
          setError(true);
          setIsRendering(false);
        }
      }
    };

    if (pdfLoaded) {
      renderPage();
    }

    return () => {
      cancelled = true;
    };
  }, [currentPage, pdfLoaded]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-10 w-10 text-red-600" />
        </div>
        <p className="text-sm text-gray-500">Could not load PDF preview</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Canvas container */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-3">Loading page {currentPage}...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-full object-contain shadow-lg rounded ${isRendering ? 'opacity-0' : 'opacity-100'}`}
          style={{ transition: 'opacity 0.3s' }}
        />
      </div>

      {/* Page Navigation */}
      {numPages > 1 && (
        <div className="flex items-center gap-4 mt-4 bg-white rounded-lg shadow-md px-4 py-2 border border-gray-200">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1 || isRendering}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setCurrentPage(page);
                  onPageChange?.(page);
                }
              }}
              className="w-12 text-center text-sm font-medium border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-500">of {numPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages || isRendering}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'details' | 'processing' | 'review'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [processedPages, setProcessedPages] = useState<ProcessedPage[]>([]);

  // File state
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cached PDF document to avoid reloading between steps
  const [cachedPdfDoc, setCachedPdfDoc] = useState<PDFDocumentProxy | null>(null);

  // Callback to cache the loaded PDF
  const handlePdfLoaded = useCallback((pdf: PDFDocumentProxy) => {
    setCachedPdfDoc(pdf);
  }, []);

  // Form state
  const [documentName, setDocumentName] = useState('');
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory>('other');
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [totalPages, setTotalPages] = useState(1);
  const [isImageBased, setIsImageBased] = useState(true);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Team assignment state (only for team role)
  const [userType, setUserType] = useState<string>('user');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>(''); // userId to assign the order to
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  // Fetch team members if user has team role
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // First get user type from session
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (sessionData?.userType) {
          setUserType(sessionData.userType);

          // Only fetch team members if user has team role
          if (sessionData.userType === 'team') {
            setIsLoadingTeam(true);
            const teamResponse = await fetch('/api/auth/team');
            const teamData = await teamResponse.json();

            if (teamData?.members) {
              // Filter only active members
              setTeamMembers(teamData.members.filter((m: TeamMember) => m.isActive));
            }
            setIsLoadingTeam(false);
          }
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setIsLoadingTeam(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const analyzePdfWithPdfJs = async (file: File): Promise<{
    hasText: boolean;
    pageCount: number;
    textSample: string;
  }> => {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;

    let totalText = '';
    const pageCount = pdf.numPages;

    // Analyze first 3 pages to detect text (or all if less than 3)
    const pagesToAnalyze = Math.min(pageCount, 3);

    for (let i = 1; i <= pagesToAnalyze; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();
      totalText += pageText + ' ';
    }

    // Clean up text
    totalText = totalText.trim();

    // Consider it has selectable text if we found more than 50 characters
    const hasText = totalText.length > 50;

    return {
      hasText,
      pageCount,
      textSample: totalText.slice(0, 200),
    };
  };

  const analyzeWordDocument = async (file: File): Promise<{
    textContent: string;
    hasText: boolean;
  }> => {
    const mammoth = await loadMammoth();
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    return {
      textContent: text.slice(0, 200),
      hasText: text.length > 50,
    };
  };

  const handleFile = async (file: File) => {
    // Validate file type - expanded to include Word documents
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ];

    // Also check by file extension for Word files
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isWordFile = fileExt === 'docx' || fileExt === 'doc';

    if (!validTypes.includes(file.type) && !isWordFile) {
      setError('Invalid file type. Please upload a PDF, image, or Word document.');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setError(null);

    // Set default document name from file name
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setDocumentName(nameWithoutExt);

    // Detect file type and create preview
    if (file.type.startsWith('image/')) {
      // Images are always image-based (scanned documents)
      const preview = URL.createObjectURL(file);
      setIsImageBased(true);
      setTotalPages(1);

      setFileInfo({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        detectedType: 'image',
        hasSelectableText: false,
        detectedPages: 1,
      });
    } else if (isWordFile || file.type.includes('word')) {
      // Word document - analyze with mammoth
      setFileInfo({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        detectedType: 'word',
        isAnalyzing: true,
      });

      try {
        const analysis = await analyzeWordDocument(file);

        setFileInfo({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          detectedType: 'word',
          hasSelectableText: true, // Word docs always have selectable text
          detectedPages: 1, // Word docs don't have explicit pages in extraction
          textContent: analysis.textContent,
          isAnalyzing: false,
        });

        setTotalPages(1);
        setIsImageBased(false); // Word docs are text-based
      } catch (err) {
        console.error('Word analysis error:', err);
        setFileInfo({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          detectedType: 'word',
          hasSelectableText: true,
          isAnalyzing: false,
        });
        setIsImageBased(false);
      }
    } else {
      // PDF file - analyze with pdf.js
      setFileInfo({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        detectedType: 'pdf',
        isAnalyzing: true,
      });

      try {
        const analysis = await analyzePdfWithPdfJs(file);

        setFileInfo({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          detectedType: 'pdf',
          hasSelectableText: analysis.hasText,
          detectedPages: analysis.pageCount,
          textContent: analysis.textSample,
          isAnalyzing: false,
        });

        setTotalPages(analysis.pageCount);
        setIsImageBased(!analysis.hasText);
      } catch (err) {
        console.error('PDF analysis error:', err);
        setFileInfo({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          detectedType: 'pdf',
          hasSelectableText: false,
          isAnalyzing: false,
        });
        setIsImageBased(true);
      }
    }
  };

  const removeFile = () => {
    if (fileInfo?.preview) {
      URL.revokeObjectURL(fileInfo.preview);
    }
    setFileInfo(null);
    setAnalysis(null);
    setCachedPdfDoc(null); // Clear cached PDF
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!fileInfo) return;

    // Move to processing step and show loading
    setStep('processing');
    setIsLoading(true);
    setError(null);
    setProcessingProgress('Preparing document...');

    try {
      // Convert file to base64 for processing
      setProcessingProgress('Converting document to base64...');
      const arrayBuffer = await fileInfo.file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      // Generate a temporary order ID for preview
      const tempOrderId = `preview-${Date.now()}`;

      setProcessingProgress('Running OCR with AWS Textract + Google Document AI...');

      // Call the processing preview endpoint (OCR + style detection)
      const response = await fetch('/api/processing/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: tempOrderId,
          pdfBase64: base64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze file');
      }

      setProcessingProgress('Processing complete! Loading results...');
      console.log('Processing preview results:', data);

      // Convert processing results to ProcessedPage format
      if (data.pages && data.pages.length > 0) {
        const pages: ProcessedPage[] = data.pages.map((page: any, index: number) => ({
          pageIndex: index,
          originalImageBase64: page.originalImageBase64 || page.imageBase64,
          processedImageBase64: page.processedImageBase64 || page.originalImageBase64 || page.imageBase64,
          blocks: page.blocks || [],
          logos: page.logos || [],
          pageWidth: page.pageWidth || page.width || 612,
          pageHeight: page.pageHeight || page.height || 792,
        }));
        console.log('[Preview] Mapped pages:', pages.map(p => ({
          pageIndex: p.pageIndex,
          hasOriginal: !!p.originalImageBase64,
          hasProcessed: !!p.processedImageBase64,
          blocksCount: p.blocks.length,
          dimensions: `${p.pageWidth}x${p.pageHeight}`
        })));
        setProcessedPages(pages);
      }

      // Create analysis result from processing response
      const analysisResult: AnalysisResult = {
        fileName: fileInfo.name,
        fileType: fileInfo.type,
        fileSize: fileInfo.size,
        fileSizeFormatted: formatFileSize(fileInfo.size),
        totalPages: data.pages?.length || totalPages,
        documentType: isImageBased ? 'image' : 'text',
        creditsPerPage: isImageBased ? 2 : 1,
        creditsRequired: (data.pages?.length || totalPages) * (isImageBased ? 2 : 1),
        accountCredits: 100, // TODO: Get from user account
        hasEnoughCredits: true,
        creditShortfall: 0,
      };

      setAnalysis(analysisResult);
      setStep('review');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('details'); // Go back to details on error
    } finally {
      setIsLoading(false);
      setProcessingProgress('');
    }
  };

  const handleCreateOrder = async () => {
    if (!fileInfo || !analysis) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentName,
          fileName: fileInfo.name,
          fileType: fileInfo.type,
          fileSize: fileInfo.size,
          fileUrl: null, // TODO: Upload to storage
          totalPages,
          documentType: isImageBased ? 'image' : 'text',
          documentCategory,
          sourceLanguage,
          targetLanguage,
          ...(assignedTo && { assignedTo }), // Include assignedTo if set (team role only)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Redirect to orders page on success
      router.push('/dashboard/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const creditsRequired = totalPages * (isImageBased ? 1 : 2);

  return (
    <div className={`mx-auto transition-all ${(step === 'upload' || step === 'details' || step === 'review') && fileInfo ? 'max-w-[1600px] px-4' : step === 'processing' ? 'max-w-3xl' : 'max-w-3xl'}`}>
      {/* Header */}
      <div className="mb-4">
        <Link href="/dashboard/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Translation Order</h1>
        <p className="text-gray-500 mt-1">Upload a document to start the translation process</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-4">
        <StepIndicator step={1} label="Upload" active={step === 'upload'} completed={step !== 'upload'} />
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <StepIndicator step={2} label="Details" active={step === 'details'} completed={step === 'processing' || step === 'review'} />
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <StepIndicator step={3} label="Processing" active={step === 'processing'} completed={step === 'review'} />
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <StepIndicator step={4} label="Review" active={step === 'review'} completed={false} />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className={fileInfo ? 'grid grid-cols-2 gap-4' : ''}>
          {/* Left side - Upload area / File info */}
          <div className={`bg-white rounded-xl border border-gray-200 p-4 ${fileInfo ? 'flex flex-col overflow-y-auto' : ''}`} style={fileInfo ? { height: 'calc(100vh - 160px)', maxHeight: '850px' } : undefined}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>

            {!fileInfo ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your document here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse from your computer
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp,.doc,.docx"
                  onChange={handleFileInput}
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" className="cursor-pointer" asChild>
                    <span>Select File</span>
                  </Button>
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  Supported: PDF, Word (DOC, DOCX), JPG, PNG, TIFF, WebP (max 50MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info Card */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fileInfo.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(fileInfo.size)}</p>
                    </div>
                    <button onClick={removeFile} className="p-1 hover:bg-gray-100 rounded">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                      {fileInfo.detectedType === 'pdf' ? 'PDF' : fileInfo.detectedType === 'word' ? 'Word' : 'Image'}
                    </span>

                    {fileInfo.detectedPages && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-purple-50 text-purple-600">
                        {fileInfo.detectedPages} {fileInfo.detectedPages === 1 ? 'page' : 'pages'}
                      </span>
                    )}

                    {!fileInfo.isAnalyzing && (fileInfo.detectedType === 'pdf' || fileInfo.detectedType === 'word') && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                        {fileInfo.hasSelectableText ? 'Has text' : 'Scanned'}
                      </span>
                    )}
                  </div>
                </div>

                {/* File Analysis Section */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <FileType className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">File Analysis</span>
                    {fileInfo.isAnalyzing ? (
                      <span className="text-xs text-purple-600 inline-flex items-center gap-1 ml-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="text-xs text-purple-600 ml-2">Complete</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* File Type */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-28">File Type:</span>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                        {fileInfo.detectedType === 'pdf' ? 'PDF Document' : fileInfo.detectedType === 'word' ? 'Word Document' : 'Image File'}
                      </span>
                    </div>

                    {/* Page Count */}
                    {fileInfo.detectedPages && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-28">Pages:</span>
                        <span className="text-sm font-medium text-gray-900">{fileInfo.detectedPages}</span>
                      </div>
                    )}

                    {/* Text Detection for PDFs and Word */}
                    {(fileInfo.detectedType === 'pdf' || fileInfo.detectedType === 'word') && !fileInfo.isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-28">Text Detection:</span>
                        <span className="text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1 bg-purple-100 text-purple-700">
                          {fileInfo.hasSelectableText ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Has selectable text
                            </>
                          ) : (
                            <>
                              <ScanLine className="h-3 w-3" />
                              Scanned / No text
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Processing Type */}
                    {!fileInfo.isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-28">Processing:</span>
                        <span className="text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1 bg-purple-100 text-purple-700">
                          {isImageBased ? (
                            <>
                              <ScanLine className="h-3 w-3" />
                              OCR (1 credit/page)
                            </>
                          ) : (
                            <>
                              <FileText className="h-3 w-3" />
                              Direct (2 credits/page)
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Sample Text Preview */}
                    {fileInfo.textContent && fileInfo.hasSelectableText && (
                      <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Extracted text sample:</p>
                        <p className="text-xs text-gray-700 italic line-clamp-2">"{fileInfo.textContent}..."</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Assignment - Only visible for team role */}
                {userType === 'team' && !fileInfo.isAnalyzing && (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Assign to Team Member</span>
                      <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                    </div>

                    {isLoadingTeam ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading team members...
                      </div>
                    ) : teamMembers.length === 0 ? (
                      <p className="text-sm text-gray-500">No team members available</p>
                    ) : (
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        <option value="">Not assigned (I will handle it)</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.firstName} {member.lastName} ({member.email})
                          </option>
                        ))}
                      </select>
                    )}

                    {assignedTo && (
                      <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        This order will be assigned to the selected team member
                      </p>
                    )}
                  </div>
                )}

                {!fileInfo.isAnalyzing && (
                  <div className="flex justify-end">
                    <Button onClick={() => setStep('details')} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Document Preview Viewer */}
          {fileInfo && (
            <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col" style={{ height: 'calc(100vh - 160px)', maxHeight: '850px' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
                {fileInfo.detectedType !== 'pdf' && (
                  <span className="text-xs text-gray-500">Page 1{fileInfo.detectedPages && fileInfo.detectedPages > 1 ? ` of ${fileInfo.detectedPages}` : ''}</span>
                )}
              </div>

              {/* Large Preview Container */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-y-auto flex-1">
                {fileInfo.isAnalyzing ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 mt-3">Loading preview...</p>
                  </div>
                ) : fileInfo.detectedType === 'image' && fileInfo.preview ? (
                  <img
                    src={fileInfo.preview}
                    alt="Document Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : fileInfo.detectedType === 'pdf' ? (
                  <LargePdfPreview
                    file={fileInfo.file}
                    totalPages={fileInfo.detectedPages}
                    pdfDoc={cachedPdfDoc}
                    onPdfLoaded={handlePdfLoaded}
                  />
                ) : fileInfo.detectedType === 'word' ? (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-12 w-12 text-purple-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Word Document</p>
                    <p className="text-sm text-gray-500 mt-1">{fileInfo.name}</p>
                    {fileInfo.textContent && (
                      <div className="mt-4 bg-white rounded-lg p-4 text-left max-w-md mx-auto border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Content preview:</p>
                        <p className="text-sm text-gray-700 line-clamp-4">{fileInfo.textContent}...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-500 mt-3">No preview available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 'details' && fileInfo && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col overflow-y-auto" style={{ height: 'calc(100vh - 160px)', maxHeight: '850px' }}>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Details</h2>

          <div className="space-y-3">
            {/* Document Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Birth Certificate - Garcia"
              />
            </div>

            {/* Document Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Category
              </label>
              <select
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Languages className="h-4 w-4 inline mr-1" />
                  Source Language
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Languages className="h-4 w-4 inline mr-1" />
                  Target Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Type Detected */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileType className="h-4 w-4 inline mr-1" />
                File Analysis
                {fileInfo.isAnalyzing ? (
                  <span className="text-xs font-normal text-blue-600 ml-2 inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing PDF...
                  </span>
                ) : (
                  <span className="text-xs font-normal text-green-600 ml-2">Auto-detected</span>
                )}
              </label>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                {/* File Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">File Type:</span>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                      {fileInfo.detectedType === 'pdf' ? 'PDF Document' : 'Image File'}
                    </span>
                  </div>
                </div>

                {/* Page Count for PDFs */}
                {fileInfo.detectedType === 'pdf' && fileInfo.detectedPages && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Pages Detected:</span>
                    <span className="text-sm font-medium text-gray-900">{fileInfo.detectedPages}</span>
                  </div>
                )}

                {/* Text Detection for PDFs */}
                {fileInfo.detectedType === 'pdf' && !fileInfo.isAnalyzing && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Text Detection:</span>
                      <span className="text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1 bg-purple-100 text-purple-700">
                        {fileInfo.hasSelectableText ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Has selectable text
                          </>
                        ) : (
                          <>
                            <ScanLine className="h-3 w-3" />
                            Scanned / No text detected
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Show sample text if detected */}
                {fileInfo.textContent && fileInfo.hasSelectableText && (
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Sample extracted text:</p>
                    <p className="text-xs text-gray-700 italic line-clamp-2">"{fileInfo.textContent}..."</p>
                  </div>
                )}

                {/* Document Processing Type */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100">
                        {isImageBased ? (
                          <ScanLine className="h-4 w-4 text-purple-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isImageBased ? 'Image-based (OCR)' : 'Text-based (Direct)'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isImageBased
                            ? 'OCR will extract text from scanned images (1 credit/page)'
                            : 'Text will be extracted directly from PDF (2 credits/page)'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsImageBased(!isImageBased)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium px-2 py-1 rounded hover:bg-purple-50"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Number of Pages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pages
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalPages}
                onChange={(e) => setTotalPages(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Credit Estimate */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Estimated Credits</p>
                  <p className="text-xs text-gray-500">
                    {totalPages} page(s) x {isImageBased ? '1' : '2'} credit(s)
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold text-purple-600">{creditsRequired}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => setStep('upload')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !documentName}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze & Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

          {/* Right side - Document Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col" style={{ height: 'calc(100vh - 160px)', maxHeight: '850px' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
              {fileInfo.detectedType !== 'pdf' && (
                <span className="text-xs text-gray-500">Page 1{fileInfo.detectedPages && fileInfo.detectedPages > 1 ? ` of ${fileInfo.detectedPages}` : ''}</span>
              )}
            </div>

            {/* Large Preview Container */}
            <div className="bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-y-auto flex-1">
              {fileInfo.isAnalyzing ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-3">Loading preview...</p>
                </div>
              ) : fileInfo.detectedType === 'image' && fileInfo.preview ? (
                <img
                  src={fileInfo.preview}
                  alt="Document Preview"
                  className="max-w-full max-h-full object-contain"
                />
              ) : fileInfo.detectedType === 'pdf' ? (
                <LargePdfPreview
                  file={fileInfo.file}
                  totalPages={fileInfo.detectedPages}
                  pdfDoc={cachedPdfDoc}
                  onPdfLoaded={handlePdfLoaded}
                />
              ) : fileInfo.detectedType === 'word' ? (
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-12 w-12 text-purple-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">Word Document</p>
                  <p className="text-sm text-gray-500 mt-1">{fileInfo.name}</p>
                  {fileInfo.textContent && (
                    <div className="mt-4 bg-white rounded-lg p-4 text-left max-w-md mx-auto border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Content preview:</p>
                      <p className="text-sm text-gray-700 line-clamp-4">{fileInfo.textContent}...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500 mt-3">No preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Document</h2>
              <p className="text-sm text-gray-500">
                Running OCR with AWS Textract + Google Document AI
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 font-medium">{processingProgress || 'Processing...'}</p>
              </div>

              <div className="text-xs text-gray-400">
                This may take a few moments depending on document size
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 'review' && fileInfo && analysis && (
        <div className="space-y-6">
          {/* Visual Comparison Section */}
          {processedPages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">OCR Results - Visual Comparison</h2>
                <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {processedPages.reduce((acc, p) => acc + p.blocks.length, 0)} text blocks detected
                </span>
              </div>
              {processedPages.map((page, index) => (
                <ComparisonView
                  key={index}
                  page={page}
                  targetLanguage={targetLanguage}
                />
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Review Order</h2>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Document</span>
                <span className="text-sm font-medium text-gray-900">{documentName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">File</span>
                <span className="text-sm font-medium text-gray-900">{fileInfo.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">File Size</span>
                <span className="text-sm font-medium text-gray-900">{analysis.fileSizeFormatted}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium text-gray-900">
                  {DOCUMENT_CATEGORIES.find(c => c.value === documentCategory)?.label}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Languages</span>
                <span className="text-sm font-medium text-gray-900">
                  {LANGUAGES.find(l => l.code === sourceLanguage)?.name} → {LANGUAGES.find(l => l.code === targetLanguage)?.name}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Document Type</span>
                <span className="text-xs font-medium px-2 py-1 rounded text-purple-600 bg-purple-50">
                  {analysis.documentType === 'image' ? 'Image-based' : 'Text-based'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Pages</span>
                <span className="text-sm font-medium text-gray-900">{analysis.totalPages}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-500">Credits Required</span>
                <span className="text-lg font-semibold text-purple-600">{analysis.creditsRequired}</span>
              </div>
            </div>
          </div>

          {/* Credits Warning or Success */}
          {analysis.hasEnoughCredits ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Ready to process</p>
                <p className="text-sm text-green-600">
                  You have {analysis.accountCredits} credits available. This order will use {analysis.creditsRequired} credits.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Insufficient credits</p>
                <p className="text-sm text-amber-600">
                  You need {analysis.creditShortfall} more credits.
                  <Link href="/dashboard/credits" className="underline ml-1">Buy credits</Link>
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800">What happens next?</p>
              <p className="text-sm text-purple-600">
                After you confirm, your document will go through OCR processing. You'll be able to review and edit the extracted text before translation begins.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('details')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleCreateOrder}
              disabled={isLoading || !analysis.hasEnoughCredits}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm & Create Order
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step, label, active, completed }: { step: number; label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
        completed
          ? 'bg-purple-600 text-white'
          : active
            ? 'bg-purple-100 text-purple-600 ring-2 ring-purple-600'
            : 'bg-gray-100 text-gray-400'
      }`}>
        {completed ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <span className={`text-sm font-medium ${active || completed ? 'text-gray-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
