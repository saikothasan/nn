import { NextRequest, NextResponse } from 'next/server';
import puppeteer from '@cloudflare/puppeteer';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface ExtractorRequestBody {
  url: string;
  query: string;
}

// Define the expected shape of the AI response
interface AiResponse {
  response?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExtractorRequestBody;
    const { url, query } = body;

    if (!url || !query) {
      return NextResponse.json({ error: 'URL and Query are required' }, { status: 400 });
    }

    const { env } = getCloudflareContext();

    if (!env.MY_BROWSER) {
        return NextResponse.json({ error: 'Browser binding not found' }, { status: 500 });
    }

    // 1. Launch Remote Browser
    const browser = await puppeteer.launch(env.MY_BROWSER);
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });

    // 2. Navigate and Scrape
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

    const pageText = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script, style, noscript');
        scripts.forEach(s => s.remove());
        
        return document.body.innerText
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 12000);
    });

    await browser.close();

    // 3. Process with AI Gateway
    const systemPrompt = `You are a precise data extraction assistant. 
    I will provide you with the text content of a website. 
    Answer the user's question based STRICTLY on that content.
    If the answer is not found in the text, state "Could not find the information in the page content."
    Format the output clearly and concisely.`;

    const userMessage = `Website Content:\n${pageText}\n\nUser Question:\n${query}`;

    // Cast the response to our interface to avoid 'any'
    const aiResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      },
      {
        gateway: {
          id: "vibesdk-gateway",
          skipCache: false
        }
      }
    ) as unknown as AiResponse;

    const answer = aiResponse?.response || "No response generated.";

    return NextResponse.json({
      success: true,
      data: answer
    });

  } catch (error: unknown) {
    console.error('Extractor Error:', error);
    // Properly handle the 'unknown' error type
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Extraction failed', details: errorMessage }, 
      { status: 500 }
    );
  }
}
