'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MapPin, RefreshCw, Copy, Check, Globe, 
  User, CreditCard, Wifi, LayoutList, FileJson,
  Link as LinkIcon
} from 'lucide-react';

// Full list of Faker v8+ supported locales
const ALL_LOCALES = [
  { code: 'af_ZA', name: 'Afrikaans (South Africa)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'bn_BD', name: 'Bengali (Bangladesh)' },
  { code: 'cs_CZ', name: 'Czech (Czechia)' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'de_AT', name: 'German (Austria)' },
  { code: 'de_CH', name: 'German (Switzerland)' },
  { code: 'el', name: 'Greek' },
  { code: 'en', name: 'English' },
  { code: 'en_AU', name: 'English (Australia)' },
  { code: 'en_CA', name: 'English (Canada)' },
  { code: 'en_GB', name: 'English (Great Britain)' },
  { code: 'en_HK', name: 'English (Hong Kong)' },
  { code: 'en_IE', name: 'English (Ireland)' },
  { code: 'en_IN', name: 'English (India)' },
  { code: 'en_NG', name: 'English (Nigeria)' },
  { code: 'en_US', name: 'English (United States)' },
  { code: 'en_ZA', name: 'English (South Africa)' },
  { code: 'es', name: 'Spanish' },
  { code: 'es_MX', name: 'Spanish (Mexico)' },
  { code: 'fa', name: 'Farsi/Persian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fr_BE', name: 'French (Belgium)' },
  { code: 'fr_CA', name: 'French (Canada)' },
  { code: 'fr_CH', name: 'French (Switzerland)' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hr', name: 'Croatian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'hy', name: 'Armenian' },
  { code: 'id_ID', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ka_GE', name: 'Georgian' },
  { code: 'ko', name: 'Korean' },
  { code: 'lv', name: 'Latvian' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'nb_NO', name: 'Norwegian' },
  { code: 'ne', name: 'Nepalese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'nl_BE', name: 'Dutch (Belgium)' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt_BR', name: 'Portuguese (Brazil)' },
  { code: 'pt_PT', name: 'Portuguese (Portugal)' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh_CN', name: 'Chinese (China)' },
  { code: 'zh_TW', name: 'Chinese (Taiwan)' },
  { code: 'zu_ZA', name: 'Zulu (South Africa)' },
].sort((a, b) => a.name.localeCompare(b.name));

// Types
interface FakeIdentity {
  identity: {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: string;
    birthday: string;
    avatar: string;
  };
  location: {
    street: string;
    buildingNumber: string;
    city: string;
    zipCode: string;
    country: string;
    countryCode: string;
    state: string;
    latitude: number;
    longitude: number;
    fullAddress: string;
    timeZone: string;
  };
  internet: {
    email: string;
    username: string;
    ip: string;
    mac: string;
    userAgent: string;
    domainName: string;
    url: string;
  };
  finance: {
    accountName: string;
    accountNumber: string;
    iban: string;
    bic: string;
    creditCardNumber: string;
    creditCardCVV: string;
    currencyName: string;
    currencyCode: string;
  };
  job: {
    title: string;
    company: string;
    department: string;
  };
  contact: {
    phone: string;
    imei: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: FakeIdentity;
  error?: string;
}

function CopyButton({ text }: { text: string | number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-teal-600"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function FieldRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
      <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono truncate max-w-[200px] md:max-w-xs text-right">
          {value}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <CopyButton text={value} />
        </div>
      </div>
    </div>
  );
}

// Inner component that uses search params
function GeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize from URL or default to US
  const initialLocale = searchParams.get('locale') || 'en_US';
  
  const [locale, setLocale] = useState(initialLocale);
  const [data, setData] = useState<FakeIdentity | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'json'>('details');

  // Update URL when locale changes
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    router.push(`?locale=${newLocale}`, { scroll: false });
  };

  // Fetch data
  const generateData = async (targetLocale: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/fake-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: targetLocale }),
      });
      const json = (await res.json()) as ApiResponse;
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect: Generate data when locale changes or on mount
  useEffect(() => {
    generateData(locale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const currentLocaleName = ALL_LOCALES.find(l => l.code === locale)?.name || locale;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Dynamic SEO Header */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
          <MapPin className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
          {currentLocaleName} Address Generator
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Generate realistic fake identity, address, and financial data for 
          <strong className="text-teal-600 dark:text-teal-400"> {currentLocaleName} </strong> 
          and 60+ other regions.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center sticky top-4 z-20 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
        
        {/* Searchable Locale Selector */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-zinc-400" />
          </div>
          <select 
            value={locale} 
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all text-zinc-900 dark:text-white appearance-none cursor-pointer"
          >
            {ALL_LOCALES.map(l => (
              <option key={l.code} value={l.code}>{l.name} ({l.code})</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => generateData(locale)}
          disabled={loading}
          className="w-full md:flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-teal-600/20"
        >
          {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <>Generate New Identity <RefreshCw className="w-4 h-4" /></>}
        </button>

        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
           <button 
             onClick={() => setActiveTab('details')}
             className={`p-2.5 rounded-lg transition-all ${activeTab === 'details' ? 'bg-white dark:bg-zinc-700 shadow text-teal-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
             title="View Details"
           >
             <LayoutList className="w-5 h-5" />
           </button>
           <button 
             onClick={() => setActiveTab('json')}
             className={`p-2.5 rounded-lg transition-all ${activeTab === 'json' ? 'bg-white dark:bg-zinc-700 shadow text-teal-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
             title="View JSON"
           >
             <FileJson className="w-5 h-5" />
           </button>
        </div>
      </div>

      {data && activeTab === 'details' && (
        <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Identity Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Personal Identity</h3>
             </div>
             
             <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={data.identity.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-zinc-200" />
                 <div>
                    <div className="font-bold text-lg text-zinc-900 dark:text-white">{data.identity.fullName}</div>
                    <div className="text-sm text-zinc-500">{data.job.title}</div>
                 </div>
             </div>

             <div className="space-y-0">
                <FieldRow label="Full Name" value={data.identity.fullName} />
                <FieldRow label="First Name" value={data.identity.firstName} />
                <FieldRow label="Last Name" value={data.identity.lastName} />
                <FieldRow label="Gender" value={data.identity.gender} />
                <FieldRow label="Birthday" value={new Date(data.identity.birthday).toLocaleDateString()} />
                <FieldRow label="Phone" value={data.contact.phone} />
                <FieldRow label="Company" value={data.job.company} />
             </div>
          </div>

          {/* 2. Location Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl">
                    <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Location Details</h3>
             </div>
             
             <div className="p-4 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl mb-6">
                 <p className="font-mono text-sm text-teal-900 dark:text-teal-100 leading-relaxed">
                    {data.location.fullAddress}
                 </p>
             </div>

             <div className="space-y-0">
                <FieldRow label="Street" value={data.location.street} />
                <FieldRow label="City" value={data.location.city} />
                <FieldRow label="State/Province" value={data.location.state} />
                <FieldRow label="Zip Code" value={data.location.zipCode} />
                <FieldRow label="Country" value={data.location.country} />
                <FieldRow label="Timezone" value={data.location.timeZone} />
                <FieldRow label="Coordinates" value={`${data.location.latitude.toFixed(4)}, ${data.location.longitude.toFixed(4)}`} />
             </div>
          </div>

          {/* 3. Internet Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                    <Wifi className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Internet & Device</h3>
             </div>
             <div className="space-y-0">
                <FieldRow label="Email" value={data.internet.email} />
                <FieldRow label="Username" value={data.internet.username} />
                <FieldRow label="Password" value="********" />
                <FieldRow label="IP Address" value={data.internet.ip} />
                <FieldRow label="MAC Address" value={data.internet.mac} />
                <FieldRow label="User Agent" value={data.internet.userAgent.substring(0, 30) + '...'} />
                <FieldRow label="Website" value={data.internet.domainName} />
             </div>
          </div>

          {/* 4. Finance Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Financial Data</h3>
             </div>
             
             {/* Fake Credit Card Visual */}
             <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-black text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 <div className="flex justify-between items-start mb-8">
                     <CreditCard className="w-8 h-8 opacity-80" />
                     <span className="font-mono text-sm opacity-60">{data.finance.currencyCode}</span>
                 </div>
                 <div className="font-mono text-xl tracking-widest mb-4 shadow-sm">{data.finance.creditCardNumber}</div>
                 <div className="flex justify-between items-end">
                     <div>
                         <div className="text-[10px] opacity-60 uppercase tracking-wider mb-0.5">Card Holder</div>
                         <div className="font-medium text-sm">{data.identity.fullName.toUpperCase()}</div>
                     </div>
                     <div className="text-right">
                         <div className="text-[10px] opacity-60 uppercase tracking-wider mb-0.5">CVV</div>
                         <div className="font-mono text-sm">{data.finance.creditCardCVV}</div>
                     </div>
                 </div>
             </div>

             <div className="space-y-0">
                <FieldRow label="IBAN" value={data.finance.iban} />
                <FieldRow label="BIC / SWIFT" value={data.finance.bic} />
                <FieldRow label="Account No" value={data.finance.accountNumber} />
                <FieldRow label="Currency" value={`${data.finance.currencyName} (${data.finance.currencyCode})`} />
             </div>
          </div>

        </div>
      )}

      {/* JSON Output Tab */}
      {data && activeTab === 'json' && (
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-inner relative group animate-in fade-in">
           <button 
                onClick={() => {navigator.clipboard.writeText(JSON.stringify(data, null, 2))}}
                className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
           >
              <Copy className="w-3.5 h-3.5" /> Copy Raw JSON
           </button>
           <pre className="font-mono text-sm text-blue-300 overflow-x-auto p-2 custom-scrollbar">
              {JSON.stringify(data, null, 2)}
           </pre>
        </div>
      )}

      {/* SEO Friendly Section: Browse All Countries */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Browse Supported Countries
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ALL_LOCALES.map(l => (
                <button
                    key={l.code}
                    onClick={() => handleLocaleChange(l.code)}
                    className={`text-left text-xs sm:text-sm px-3 py-2 rounded-lg transition-colors truncate
                        ${l.code === locale 
                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium' 
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                >
                    {l.name}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// Main Component wrapped in Suspense for useSearchParams
export default function FakeAddressGenerator() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading generator...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
