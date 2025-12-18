import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 1. Define the Upstream API Interface (What binlist.io returns)
interface BinListResponse {
  number: {
    length: number;
    luhn: boolean;
  };
  scheme: string;
  type: string;
  brand: string;
  prepaid: boolean;
  category: string;
  country: {
    numeric: string;
    alpha2: string;
    alpha3: string;
    name: string;
    emoji: string;
    currency: string;
    latitude: number;
    longitude: number;
  };
  bank: {
    name: string;
    url: string;
    phone: string;
    city: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const binInput = searchParams.get('bin');

    if (!binInput) {
      return NextResponse.json({ error: 'Please provide a "bin" query parameter.' }, { status: 400 });
    }

    // Sanitize input: Binlist.io requires the first 6 or 8 digits
    const bin = binInput.replace(/\D/g, '').substring(0, 6);

    if (bin.length < 6) {
      return NextResponse.json({ error: 'BIN must contain at least 6 digits.' }, { status: 400 });
    }

    // 2. Fetch from External API
    // Note: binlist.io has a rate limit (approx 10 requests/min for free tier).
    const apiUrl = `https://binlist.io/lookup/${bin}`;
    console.log(`Fetching upstream: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept-Version': '3', // Good practice for external APIs
      },
    });

    // Handle 404 (BIN not found) specifically
    if (response.status === 404) {
      return NextResponse.json({ success: false, error: 'BIN not found in global database.' }, { status: 404 });
    }

    // Handle other errors (Rate limits, server errors)
    if (!response.ok) {
      console.error(`Upstream Error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: 'External service unavailable. Please try again later.' }, { status: 502 });
    }

    const data = (await response.json()) as BinListResponse;

    // 3. Adapter: Map External Data to Internal Format
    // This ensures your frontend (BinChecker.tsx) works without ANY changes.
    return NextResponse.json({
      success: true,
      data: {
        bin: bin,
        brand: data.scheme || 'Unknown', // "VISA", "MASTERCARD"
        type: data.type || 'Unknown',   // "DEBIT", "CREDIT"
        category: data.category || '',
        issuer: data.bank?.name || 'Unknown',
        issuer_phone: data.bank?.phone || '',
        issuer_url: data.bank?.url || '',
        country: {
          name: data.country?.name || 'Unknown',
          iso2: data.country?.alpha2 || '',
          iso3: data.country?.alpha3 || '',
        },
      },
    });

  } catch (error) {
    console.error('Error in bin-checker API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
