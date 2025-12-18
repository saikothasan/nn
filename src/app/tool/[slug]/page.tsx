import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTool, getToolsByCategory, tools } from '@/lib/tools-config';
import { Metadata } from 'next';
import { ChevronRight, Home, Share2, ShieldCheck } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>
};

// 1. Dynamic SEO Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} - Free Online Tools`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
    }
  };
}

// 2. Static Generation
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

  // SEO Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Web',
    applicationCategory: tool.category,
    description: tool.description,
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
            
            {/* Tool Header Card */}
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

            {/* THE TOOL WORKSPACE */}
            <div className="bg-white dark:bg-[#111] rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-800 p-1">
               <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-[22px] p-6 md:p-10 min-h-[500px] border border-gray-100 dark:border-gray-800/50">
                 <ToolComponent />
               </div>
            </div>

            {/* SEO Content Article */}
            <article className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2>About {tool.name}</h2>
              <p>
                The <strong>{tool.name}</strong> is a professional utility designed for developers and security professionals. 
                Unlike other tools, we process data using Cloudflare's secure edge network, ensuring speed and privacy.
              </p>
              
              <h3>Features</h3>
              <ul>
                <li><strong>Instant Results:</strong> Powered by Edge Computing.</li>
                <li><strong>Privacy First:</strong> We do not store your personal data.</li>
                <li><strong>Open Source:</strong> Transparent logic you can trust.</li>
              </ul>

              <h3>How to use</h3>
              <p>
                Simply enter the required input above and click the action button. The tool will instantly query our 
                secure databases and return the results in a clean, JSON-structured format.
              </p>
            </article>
          </div>

          {/* Sidebar / Related Tools */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Share / Info Card */}
            <div className="bg-blue-600 dark:bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Share this tool
              </h3>
              <p className="text-blue-100 text-sm mb-6">
                Help other developers by sharing this free utility.
              </p>
              <div className="flex gap-2">
                 <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-xl text-sm font-medium transition-colors">
                   Copy Link
                 </button>
                 <button className="flex-1 bg-white text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-sm font-medium transition-colors">
                   Tweet
                 </button>
              </div>
            </div>

            {/* Related Tools List */}
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
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {t.description}
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
