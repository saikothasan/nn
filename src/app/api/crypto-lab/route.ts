import { generateKeyPairSync, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

// Define the expected shape of the request body
interface CryptoRequestBody {
  type: string;
  length?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Cast the unknown result to our interface
    const body = (await req.json()) as CryptoRequestBody;
    const { type, length } = body;

    let result = {};

    if (type === 'rsa') {
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: length || 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });
      result = { publicKey, privateKey };
    } 
    else if (type === 'api-key') {
      result = { key: `pk_live_${randomBytes(24).toString('hex')}` };
    }
    else if (type === 'secret') {
      result = { secret: randomBytes(64).toString('base64') };
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
