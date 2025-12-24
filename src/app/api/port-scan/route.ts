import { connect } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get('host');
  
  if (!host) return NextResponse.json({ error: 'Host required' }, { status: 400 });

  const ports = [21, 22, 25, 53, 80, 443, 3306, 5432, 8080];
  
  const checkPort = (port: number) => new Promise((resolve) => {
    const socket = connect(port, host);
    socket.setTimeout(1500); // Fast timeout

    socket.on('connect', () => {
      socket.destroy();
      resolve({ port, status: 'open', service: getServiceName(port) });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'closed', service: getServiceName(port) });
    });

    socket.on('error', () => {
      resolve({ port, status: 'closed', service: getServiceName(port) });
    });
  });

  const results = await Promise.all(ports.map(checkPort));
  return NextResponse.json({ host, results });
}

function getServiceName(port: number) {
  const map: Record<number, string> = {
    21: 'FTP', 22: 'SSH', 25: 'SMTP', 53: 'DNS', 
    80: 'HTTP', 443: 'HTTPS', 3306: 'MySQL', 5432: 'PostgreSQL', 8080: 'Web Alt'
  };
  return map[port] || 'Unknown';
}
