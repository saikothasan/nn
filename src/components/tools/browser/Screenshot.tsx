'use client';

import React, { useState } from 'react';
import { Camera, Download, Loader2, AlertCircle } from 'lucide-react';

export default function ScreenshotTool() {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // Normalize URL
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      
      const apiEndpoint = `/api/browser/screenshot?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(apiEndpoint);

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.details || 'Failed to capture screenshot');
      }

      // Create a local blob URL for the image
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <form onSubmit={handleScreenshot} className="flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
            Capture
          </button>
        </form>
        {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        )}
      </div>

      {/* Result Section */}
      {imageUrl && (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-200">Result</h3>
            <a 
              href={imageUrl} 
              download={`screenshot-${Date.now()}.png`}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          </div>
          <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt="Website Screenshot" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
