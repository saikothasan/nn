import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for native fetch performance

interface CurlRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { method, url, headers, body } = (await req.json()) as CurlRequest;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Start Timer
    const startTime = performance.now();

    // 2. Prepare Options
    const fetchOptions: RequestInit = {
      method,
      headers: headers || {},
      redirect: 'follow',
    };

    // Only attach body for non-GET/HEAD methods
    if (method !== 'GET' && method !== 'HEAD' && body) {
      fetchOptions.body = body;
    }

    // 3. Execute Fetch (from Cloudflare Edge)
    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (fetchError: unknown) {
      return NextResponse.json({ 
        error: 'Network Error', 
        details: fetchError instanceof Error ? fetchError.message : String(fetchError) 
      }, { status: 502 });
    }

    // 4. End Timer
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // 5. Process Response
    const responseBody = await response.text();
    
    // Extract headers into a plain object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      timing: {
        duration, // Total time in ms
      },
      meta: {
        url: response.url,
        redirected: response.redirected
      }
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
