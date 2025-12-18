import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTool, getToolsByCategory, tools } from '@/lib/tools-config';
import { Metadata } from 'next';
import { ChevronRight, Home, Share2, ShieldCheck, Send } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} - Free Online Tool | ProKit`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://prokit.uk/tool/${slug}`,
    },
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
      url: `https://prokit.uk/tool/${slug}`,
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
  const relatedTools = getToolsByCategory(tool.category).filter(t => t.slug !== tool.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Web',
    applicationCategory: tool.category,
    description: tool.description,
    url: `https://prokit.uk/tool/${slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="capitalize text-gray-900 dark:text-gray-100 font-medium">{tool.category} Tools</span>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">{tool.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tool Header */}
            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <tool.icon className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 capitalize border border-blue-100 dark:border-blue-800">
                    {tool.category}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800">
                    <ShieldCheck className="w-3 h-3" /> Secure & Private
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {tool.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Tool Component (Includes its own SEO Text now) */}
            <ToolComponent />

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Telegram Promo Card (Sidebar) */}
            <a 
               href="https://t.me/drkingbd"
               target="_blank"
               className="block bg-[#0088cc] rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform"
            >
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Send className="w-5 h-5" /> Join our Telegram
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest tools, updates, and developer resources directly in your feed.
              </p>
              <div className="bg-white/20 backdrop-blur-sm py-2 px-4 rounded-xl text-sm font-medium text-center hover:bg-white/30 transition-colors">
                 @drkingbd
              </div>
            </a>

            {/* Share Card */}
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Share Tool
              </h3>
              <div className="flex gap-2">
                 <button className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 rounded-xl text-sm font-medium transition-colors text-gray-700 dark:text-gray-300">
                   Copy Link
                 </button>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  More {tool.category} Tools
                </h3>
                <div className="space-y-3">
                  {relatedTools.map((t) => (
                    <Link 
                      key={t.slug}
                      href={`/tool/${t.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 group transition-colors"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <t.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
