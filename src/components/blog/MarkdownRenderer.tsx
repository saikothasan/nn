'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- Components ---

// 1. Code Block with Copy Button
const CodeBlock = ({ children, className, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4. Chart Renderer (Triggered by ```json chart)
  if (language === 'chart' || (language === 'json' && codeString.includes('"chartType":'))) {
    try {
      const data = JSON.parse(codeString).data;
      return (
        <div className="my-8 h-[300px] w-full bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#888', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#888', fontSize: 12}} 
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } catch (e) {
      return <div className="text-red-500 text-sm p-4 bg-red-50 rounded">Invalid Chart Data</div>;
    }
  }

  return match ? (
    <div className="relative group rounded-xl overflow-hidden my-6 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xs font-mono text-gray-500 lowercase">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-500"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-code)' }}
        wrapLongLines
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={`${className} bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400 font-mono`} {...props}>
      {children}
    </code>
  );
};

// 2. YouTube Embed (Triggered by standard links or custom logic)
const LinkRenderer = (props: any) => {
  const { href } = props;
  const isYoutube = href.includes('[youtube.com/watch](https://youtube.com/watch)') || href.includes('youtu.be');

  if (isYoutube) {
    const videoId = href.split('v=')[1]?.split('&')[0] || href.split('/').pop();
    return (
      <div className="my-8 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <a 
      {...props} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 dark:text-blue-400 hover:underline decoration-blue-300 underline-offset-2 transition-colors"
    />
  );
};

// --- Main Component ---
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock,
        a: LinkRenderer,
        // 3. Beautiful Tables
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm text-left">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">
            {children}
          </thead>
        ),
        th: ({ children }) => <th className="px-6 py-4">{children}</th>,
        td: ({ children }) => <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">{children}</td>,
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-blue-500 pl-6 italic text-xl text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 py-4 pr-4 rounded-r-lg">
            {children}
          </blockquote>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
