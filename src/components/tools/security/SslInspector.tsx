'use client';

import { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, Calendar, Lock, FileKey } from 'lucide-react';

interface SslData {
  days_remaining: number;
  valid_from: string;
  valid_to: string;
  protocol: string;
  cipher: string;
  fingerprint: string;
  subject: { CN: string };
  issuer: { O: string };
  error?: string;
}

export default function SslInspector() {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<SslData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkSsl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/ssl-check?host=${encodeURIComponent(domain)}`);
      const json = (await res.json()) as SslData;
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Tool Section */}
      <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <form onSubmit={checkSsl} className="flex gap-4 max-w-3xl mx-auto mb-8">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
          <button
            disabled={loading || !domain}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? 'Scanning...' : <><Search size={20} /> Inspect</>}
          </button>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/50">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {data && (
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
            {/* Status Card */}
            <div className="md:col-span-2 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-full ${data.days_remaining > 30 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.subject.CN}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                     Issued by <span className="font-semibold">{data.issuer.O}</span>
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className={`text-4xl font-bold ${data.days_remaining > 30 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {data.days_remaining}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Days Left</p>
              </div>
            </div>

            {/* Validity Details */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                <Calendar className="w-5 h-5 text-blue-500" /> Validity Period
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Issued On</span>
                  <span className="font-mono font-medium">{new Date(data.valid_from).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Expires On</span>
                  <span className="font-mono font-medium">{new Date(data.valid_to).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Tech Details */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                <Lock className="w-5 h-5 text-purple-500" /> Encryption
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Protocol</span>
                  <span className="font-mono font-medium">{data.protocol}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Cipher</span>
                  <span className="font-mono font-medium truncate max-w-[150px]" title={data.cipher}>{data.cipher}</span>
                </div>
              </div>
            </div>
            
            {/* Fingerprint */}
            <div className="md:col-span-2 p-6 bg-gray-900 text-gray-300 rounded-2xl font-mono text-xs break-all">
               <div className="flex items-center gap-2 text-gray-400 mb-2 font-sans font-bold text-sm">
                 <FileKey className="w-4 h-4" /> Certificate Fingerprint
               </div>
               {data.fingerprint}
            </div>
          </div>
        )}
      </div>

      {/* SEO Text */}
      <article className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800">
        <h2>SSL Certificate Checker</h2>
        <p>
          Secure your website and build trust with visitors by validating your SSL/TLS configuration. 
          Our <strong>SSL Inspector</strong> performs a deep handshake analysis to verify certificate validity, 
          expiration dates, and chain of trust.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Why Check SSL?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">Expired certificates cause security warnings that scare away up to 90% of users. Regular monitoring ensures zero downtime.</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">Technical Insight</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">Verify you are using modern protocols (TLS 1.2/1.3) and strong ciphers to prevent MITM attacks.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
