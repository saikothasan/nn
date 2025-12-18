import { NextRequest, NextResponse } from 'next/server';
import puppeteer from '@cloudflare/puppeteer';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Configuration
const R2_CUSTOM_DOMAIN = 'https://c.prokit.uk';
const GATEWAY_ID = "vibesdk-gateway";

// FIX: Define the expected request body shape
interface AuditRequestBody {
  url?: string;
  focus?: string;
}

export async function POST(req: NextRequest) {
  try {
    // FIX: Cast the json result to our interface
    const body = (await req.json()) as AuditRequestBody;
    const { url, focus = "General Audit" } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { env } = getCloudflareContext();

    // 1. Launch Browser & Scrape
    const browser = await puppeteer.launch(env.MY_BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // 2. Extract Data (Text Content for AI)
    const pageText = await page.evaluate(() => {
        return document.body.innerText.slice(0, 5000); // Limit context window
    });

    // 3. Take Screenshot & Upload to R2
    const screenshotBuffer = await page.screenshot();
    const filename = `audits/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    await env.MY_FILES.put(filename, screenshotBuffer, {
      httpMetadata: { contentType: 'image/png' }
    });

    await browser.close();

    // 4. Analyze with AI Gateway
    const systemPrompt = `You are a senior web developer and UX expert. 
    Analyze the website content provided below. 
    Focus your audit on: ${focus}.
    Provide a concise, actionable list of improvements.
    Format your response in Markdown.`;

    const userMessage = `URL: ${url}\n\nWebsite Content:\n${pageText}`;

    const aiResponse: unknown = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      },
      {
        gateway: {
          id: GATEWAY_ID,
          skipCache: false 
        },
      }
    );
    
    // SAFE TYPE CHECKING
    let analysisText = "No analysis generated.";
    if (
      typeof aiResponse === 'object' && 
      aiResponse !== null && 
      'response' in aiResponse && 
      typeof (aiResponse as { response: string }).response === 'string'
    ) {
      analysisText = (aiResponse as { response: string }).response;
    }

    return NextResponse.json({
      success: true,
      screenshot: `${R2_CUSTOM_DOMAIN}/${filename}`,
      analysis: analysisText
    });

  } catch (error: unknown) {
    console.error('Audit Error:', error);
    return NextResponse.json(
      { error: 'Failed to perform audit', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
