import { NextRequest, NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { fetch } from 'next/dist/compiled/@edge-runtime/primitives'; // or global fetch

// Use Node.js compatibility mode for NPM libraries
//export const runtime = 'nodejs';

interface ProxyCheckBody {
  proxies: string[];
  timeout?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ProxyCheckBody;
    const { proxies, timeout = 5000 } = body;

    if (!proxies || !Array.isArray(proxies)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const results = await Promise.all(
      proxies.map(async (proxyStr) => {
        const start = Date.now();
        // Ensure protocol exists (default to http)
        const formattedProxy = proxyStr.startsWith('http') ? proxyStr : `http://${proxyStr}`;

        try {
          // Create an agent for this specific proxy
          const agent = new HttpsProxyAgent(formattedProxy);
          
          // Controller to handle timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Attempt to fetch a reliable, small endpoint (Google or similar)
          const response = await fetch('https://www.google.com/generate_204', {
            agent: agent as any, // Type cast for Next.js fetch compatibility
            signal: controller.signal,
            method: 'HEAD' // Lightweight request
          });

          clearTimeout(timeoutId);

          if (response.ok || response.status === 204) {
             return { 
              proxy: proxyStr, 
              status: 'Active', 
              latency: Date.now() - start, 
              healthy: true 
            };
          } else {
             throw new Error(`Status ${response.status}`);
          }

        } catch (error) {
          return { 
            proxy: proxyStr, 
            status: 'Dead', 
            latency: 0, 
            healthy: false 
          };
        }
      })
    );

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Proxy check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
