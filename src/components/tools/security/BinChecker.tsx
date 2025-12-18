'use client';

import { useState } from 'react';
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// 1. Data Interfaces
interface BinData {
  bin: string;
  brand: string;
  type: string;
  category: string;
  issuer: string;
  issuer_phone: string;
  issuer_url: string;
  country: {
    name: string;
    iso2: string;
    iso3: string;
  };
}

type BinApiResponse = 
  | { success: true; data: BinData }
  | { success: false; error: string }
  | { error: string };

export default function BinChecker() {
  const [bin, setBin] = useState('');
  const [data, setData] = useState<BinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setData(null);
    
    try {
      const res = await fetch(`/api/bin-checker?bin=${bin}`);
      const json = (await res.json()) as BinApiResponse; 
      
      if (!res.ok) {
        const errorMessage = 'error' in json ? json.error : 'Failed to fetch data';
        throw new Error(errorMessage);
      }
      
      if ('data' in json) {
        setData(json.data);
      } else {
         throw new Error('Invalid response format');
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- 1. THE INTERACTIVE TOOL SECTION --- */}
      <div className="bg-white dark:bg-[#111] rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-800 p-1 mb-10">
        <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-[22px] p-6 md:p-10 min-h-[300px] border border-gray-100 dark:border-gray-800/50">
          
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
               <h3 className="text-xl font-semibold mb-2">Check BIN Details</h3>
               <p className="text-sm text-gray-500">Enter the first 6 digits of any credit or debit card.</p>
            </div>

            <div className="flex gap-2 mb-8 relative">
              <input
                value={bin}
                onChange={(e) => setBin(e.target.value)}
                placeholder="e.g. 453211"
                maxLength={8}
                className="flex-1 p-4 pl-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-lg"
              />
              <button 
                onClick={handleCheck}
                disabled={loading || bin.length < 6}
                className="bg-black dark:bg-white text-white dark:text-black px-8 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                Check
              </button>
            </div>

            {error && (
               <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/20">
                 <AlertCircle className="w-5 h-5" /> {error}
               </div>
            )}

            {data && (
              <div className="grid grid-cols-2 gap-4 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ResultItem label="Brand" value={data.brand} />
                <ResultItem label="Type" value={data.type} />
                <ResultItem label="Category" value={data.category} />
                <ResultItem label="Issuer" value={data.issuer} />
                <ResultItem label="Country" value={data.country.name} />
                <ResultItem label="ISO Code" value={data.country.iso2} />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- 2. THE OWN SEO CONTENT SECTION --- */}
      <article className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800">
        <h2>About BIN Checker</h2>
        <p>
          This <strong>Bank Identification Number (BIN) Checker</strong> is a professional utility designed to help merchants, 
          developers, and security professionals instantly validate credit and debit card information.
        </p>
        
        <h3>How it works</h3>
        <p>
          Every payment card contains a unique sequence of numbers. The first 6 to 8 digits (known as the IIN or BIN) 
          identify the issuing bank and the type of card. Our tool queries a massive, real-time database to return precise details.
        </p>

        <h3>Why use ProKit BIN Checker?</h3>
        <ul>
          <li><strong>Fraud Prevention:</strong> Confirm if the card&apos;s country matches the customer&apos;s billing address.</li>
          <li><strong>Payment Optimization:</strong> Determine if a card is Prepaid, Debit, or Credit to route payments correctly.</li>
          <li><strong>Issuer Identification:</strong> Instantly find the bank name and contact details.</li>
        </ul>

        <div className="not-prose bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 my-8">
           <h4 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 mb-2">
             <CheckCircle className="w-5 h-5" /> Privacy Guarantee
           </h4>
           <p className="text-sm text-blue-800 dark:text-blue-200">
             We do not store or log any card numbers you enter. All lookups are processed anonymously via our secure edge network.
           </p>
        </div>
      </article>
    </>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="text-gray-500 uppercase text-[10px] tracking-wider font-bold mb-1">{label}</div>
      <div className="font-mono font-medium text-gray-900 dark:text-gray-100 truncate" title={value}>{value}</div>
    </div>
  );
}
