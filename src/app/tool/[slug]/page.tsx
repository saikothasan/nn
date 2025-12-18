import { notFound } from 'next/navigation';
import { getTool, tools } from '@/lib/tools-config';
import { Metadata } from 'next';

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
  };
}

// 2. Static Generation (Optional, but great for Cloudflare/SEO)
export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 mb-4">
          <tool.icon className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {tool.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {tool.description}
        </p>
      </div>

      {/* The Tool Interface Workspace */}
      <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-10 min-h-[400px]">
        <ToolComponent />
      </div>

      {/* SEO Content Section (Important for ranking) */}
      <article className="mt-16 prose dark:prose-invert max-w-none">
        <h2>How to use the {tool.name}</h2>
        <p>
          This free online {tool.name.toLowerCase()} allows you to...
          {/* You can extend tools-config to include a 'longDescription' or 'content' field to render here */}
        </p>
      </article>
    </div>
  );
}
