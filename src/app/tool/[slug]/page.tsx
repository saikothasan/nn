import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTool, getToolsByCategory, tools } from '@/lib/tools-config';
import type { Metadata } from 'next';
import { ChevronRight, ShieldCheck, Zap, Activity, Share2, Terminal } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} // ProKit System`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
      url: `https://prokit.uk/tool/${slug}`,
      siteName: 'ProKit Infrastructure',
    }
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  const ToolComponent = tool.component;
  const relatedTools = getToolsByCategory(tool.category).filter(t => t.slug !== tool.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Edge Runtime',
    applicationCategory: tool.category,
    description: tool.description,
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Technical Header / Control Strip */}
      <div className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-sm">
          
          {/* Breadcrumb Path */}
          <nav className="flex items-center text-[var(--muted-foreground)] font-mono">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              ~/index
            </Link>
            <span className="mx-2 text-[var(--border)]">/</span>
            <Link href={`/categories#${tool.category}`} className="hover:text-[var(--foreground)] transition-colors">
              {tool.category}
            </Link>
            <span className="mx-2 text-[var(--border)]">/</span>
            <span className="text-[var(--foreground)] font-medium">
              {tool.slug}
            </span>
          </nav>

          {/* Metadata Tags */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
             <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
               <ShieldCheck className="w-3.5 h-3.5" />
               <span>VERIFIED_SECURE</span>
             </div>
             <div className="w-px h-3 bg-[var(--border)]" />
             <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
               <Zap className="w-3.5 h-3.5" />
               <span>LATENCY: &lt;10ms</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3rem)]">
        
        {/* 2. Main Workspace (Left/Center) */}
        <main className="lg:col-span-9 border-r border-[var(--border)] bg-[var(--background)]">
          {/* Tool Title Block */}
          <header className="px-6 py-10 border-b border-[var(--border)] bg-[var(--muted)]/20">
             <div className="flex items-start justify-between">
               <div>
                 <div className="mb-2 inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]">
                   <Activity className="w-3 h-3" />
                   Active Session
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
                   {tool.name}
                 </h1>
                 <p className="text-lg text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
                   {tool.description}
                 </p>
               </div>
               <div className="hidden md:block opacity-10">
                 <tool.icon className="w-24 h-24" />
               </div>
             </div>
          </header>

          {/* Tool Interface Wrapper */}
          <div className="p-6 md:p-10 min-h-[500px]">
            <ToolComponent />
          </div>
        </main>

        {/* 3. Context Sidebar (Right) */}
        <aside className="lg:col-span-3 bg-[var(--muted)]/10 flex flex-col">
          
          {/* "Network" Promo */}
          <div className="p-6 border-b border-[var(--border)]">
             <div className="bg-[var(--background)] border border-[var(--border)] p-4 rounded-sm hover:border-[var(--foreground)] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)] uppercase">
                    <Terminal className="w-3.5 h-3.5" />
                    Network Node
                  </div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--foreground)] mb-1">
                  Join the Developer Channel
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-4 leading-relaxed">
                  Receive API keys, system updates, and new tools directly in your stream.
                </p>
                <a 
                  href="https://t.me/drkingbd" 
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
                >
                  CONNECT @DRKINGBD
                </a>
             </div>
          </div>

          {/* Related Modules */}
          <div className="p-6 flex-1">
            <h3 className="text-xs font-mono font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5" />
              Related Modules
            </h3>
            
            <div className="space-y-px border border-[var(--border)] bg-[var(--border)]">
              {relatedTools.length > 0 ? (
                relatedTools.map((t) => (
                  <Link 
                    key={t.slug}
                    href={`/tool/${t.slug}`}
                    className="block bg-[var(--background)] p-3 hover:bg-[var(--muted)] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[var(--foreground)] group-hover:underline decoration-1 underline-offset-2">
                        {t.name}
                      </span>
                      <ChevronRight className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                      {t.description}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-[var(--background)] p-4 text-xs text-[var(--muted-foreground)] text-center italic">
                  No related modules active.
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
