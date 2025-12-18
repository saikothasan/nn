import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();
    
    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }

    // Access Cloudflare Bindings
    const { env } = getCloudflareContext();

    // Use Cloudflare Workers AI (Ensure 'AI' binding exists in wrangler.jsonc)
    // We utilize the M2M100 model which is great for translation
    const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: text,
      target_lang: targetLang
    });

    return NextResponse.json({ 
      success: true, 
      translated: response.translated_text 
    });

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
