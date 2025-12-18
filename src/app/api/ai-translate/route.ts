import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = 'edge';

// 1. Request Interface
interface TranslateRequest {
  text: string;
  targetLang: string;
}

// 2. Response Interface (Fixes the "Unexpected any" error)
interface AiTranslationResponse {
  translated_text: string;
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = (await req.json()) as TranslateRequest;
    
    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }

    const { env } = getCloudflareContext();

    // 3. Run AI Model
    // We cast to 'unknown' first, then to our interface to satisfy TS rules
    const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: text,
      target_lang: targetLang
    }) as unknown as AiTranslationResponse;

    return NextResponse.json({ 
      success: true, 
      translated: response.translated_text 
    });

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
