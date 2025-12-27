import { connect } from 'node:tls';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get('host');
  
  if (!host) {
    return NextResponse.json({ error: 'Host is required' }, { status: 400 });
  }

  // Strip protocol and path if user pasted a full URL
  const cleanHost = host.replace(/^https?:\/\//, '').split('/')[0];

  return new Promise<NextResponse>((resolve) => {
    try {
      // 5 second timeout safety
      const timeoutId = setTimeout(() => {
        resolve(NextResponse.json({ error: 'Connection timed out' }, { status: 504 }));
      }, 5000);

      const socket = connect(443, cleanHost, { servername: cleanHost, rejectUnauthorized: false }, () => {
        clearTimeout(timeoutId);
        
        // Detailed set to true to get dates
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();
        
        // Close immediately
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
           resolve(NextResponse.json({ error: 'No certificate found' }, { status: 404 }));
           return;
        }

        const validTo = cert.valid_to ? new Date(cert.valid_to).getTime() : 0;
        const daysRemaining = validTo ? Math.floor((validTo - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

        // Simplify objects to avoid Buffer serialization issues
        resolve(NextResponse.json({
          subject: typeof cert.subject === 'object' ? cert.subject : { CN: 'Unknown' },
          issuer: typeof cert.issuer === 'object' ? cert.issuer : { CN: 'Unknown' },
          valid_from: cert.valid_from,
          valid_to: cert.valid_to,
          days_remaining: daysRemaining,
          serialNumber: cert.serialNumber,
          fingerprint: cert.fingerprint,
          cipher: cipher ? `${cipher.name} (${cipher.version})` : 'Unknown',
          protocol: protocol
        }));
      });

      socket.on('error', (err) => {
        clearTimeout(timeoutId);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An error occurred';
        resolve(NextResponse.json({ error: message }, { status: 500 }));
    }
  });
}
