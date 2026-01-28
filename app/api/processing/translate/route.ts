import { NextRequest, NextResponse } from 'next/server';

// API Gateway URL - all requests go through the gateway
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3001';

/**
 * POST /api/processing/translate
 * Translate an array of texts using the processing microservice
 *
 * Flow: Frontend → Next.js API → API Gateway → Processing MS
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { texts, targetLanguage } = body;

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return NextResponse.json(
                { error: 'texts array is required' },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            return NextResponse.json(
                { error: 'targetLanguage is required' },
                { status: 400 }
            );
        }

        console.log(`[Translate] Translating ${texts.length} texts to ${targetLanguage}`);

        // Call API Gateway which proxies to Processing MS
        const response = await fetch(`${API_GATEWAY_URL}/processing/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts,
                targetLanguage,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Translate] Error:', errorData);
            return NextResponse.json(
                { error: errorData.error || errorData.message || 'Translation failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[Translate] Completed: ${data.translations?.length || 0} translations`);

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Translate] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to translate' },
            { status: 500 }
        );
    }
}
