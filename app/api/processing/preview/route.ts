import { NextRequest, NextResponse } from 'next/server';

// API Gateway URL - all requests go through the gateway
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3001';

// Route segment config for App Router - body size limit handled in next.config.ts
export const maxDuration = 120; // 2 minutes timeout for processing

/**
 * POST /api/processing/preview
 * Process a document up to stage 4 (style detection) for preview
 * Returns OCR results with styles for frontend visualization
 *
 * Flow: Frontend → Next.js API → API Gateway → Processing MS
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, pdfBase64 } = body;

        if (!orderId || !pdfBase64) {
            return NextResponse.json(
                { error: 'Missing required fields: orderId and pdfBase64' },
                { status: 400 }
            );
        }

        console.log(`[Processing Preview] Starting for order ${orderId}`);
        console.log(`[Processing Preview] Calling API Gateway at ${API_GATEWAY_URL}/processing/preview`);

        // Call API Gateway which proxies to Processing MS
        const response = await fetch(`${API_GATEWAY_URL}/processing/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                pdfBase64,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Processing Preview] Error:', errorData);
            return NextResponse.json(
                { error: errorData.error || errorData.message || 'Processing failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[Processing Preview] Completed for order ${orderId}`);

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Processing Preview] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process document' },
            { status: 500 }
        );
    }
}
