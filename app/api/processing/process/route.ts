import { NextRequest, NextResponse } from 'next/server';

const PROCESSING_MS_URL = process.env.PROCESSING_MS_URL || 'http://localhost:3014';

// Route segment config for App Router - body size limit handled in next.config.ts
export const maxDuration = 120; // 120 seconds timeout for full processing

/**
 * POST /api/processing/process
 * Process a document through the full pipeline (OCR, translation, reconstruction)
 * Returns the reconstructed PDF with translated text
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            orderId,
            pdfBase64,
            sourceLanguage,
            targetLanguage,
            skipTranslation = false,
            returnIntermediateResults = false,
        } = body;

        if (!orderId || !pdfBase64 || !targetLanguage) {
            return NextResponse.json(
                { error: 'Missing required fields: orderId, pdfBase64, and targetLanguage' },
                { status: 400 }
            );
        }

        console.log(`[Processing] Starting full processing for order ${orderId}`);
        console.log(`[Processing] Target language: ${targetLanguage}, Source: ${sourceLanguage || 'auto'}`);

        // Call processing-ms microservice
        const response = await fetch(`${PROCESSING_MS_URL}/api/processing/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                pdfBase64,
                sourceLanguage,
                targetLanguage,
                options: {
                    skipTranslation,
                    returnIntermediateResults,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Processing] Error:', errorData);
            return NextResponse.json(
                { error: errorData.error || errorData.message || 'Processing failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[Processing] Completed for order ${orderId}`);

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Processing] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process document' },
            { status: 500 }
        );
    }
}
