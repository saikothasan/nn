'use client';
import { useState } from 'react';
import { ArrowRightLeft, Sparkles, Copy, Loader2 } from 'lucide-react';

// 1. Define the Expected API Response Interface
interface TranslationResponse {
  success: boolean;
  translated: string;
  error?: string;
}

export default function Translator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [lang, setLang] = useState('spanish');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: lang })
      });
      
      // 2. Type Cast: Tell TypeScript what the data looks like
      const data = (await res.json()) as TranslationResponse;
      
      if (data.success) {
        setResult(data.translated);
      } else {
        console.error("Translation failed:", data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Input */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-500">Input Text</label>
          <textarea 
            className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Type something to translate..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex md:flex-col items-center justify-center gap-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
            <ArrowRightLeft size={20} className="md:rotate-90" />
          </div>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium outline-none"
          >
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="japanese">Japanese</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>

        {/* Output */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-gray-500">Translation</label>
          <div className="relative w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
             {loading ? (
               <div className="flex items-center justify-center h-full text-blue-500">
                 <Loader2 className="animate-spin" />
               </div>
             ) : (
               <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{result}</p>
             )}
             {result && (
               <button 
                 onClick={() => navigator.clipboard.writeText(result)}
                 className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-blue-500 transition-colors"
               >
                 <Copy size={16} />
               </button>
             )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleTranslate}
        disabled={loading || !text}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        Translate with AI
      </button>
    </div>
  );
}
