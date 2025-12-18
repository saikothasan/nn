import Link from 'next/link';
import { tools, ToolCategory } from '@/lib/tools-config';
import { ArrowRight, Tag } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tool Categories',
  description: 'Browse our collection of developer tools by category.',
};

export default function CategoriesPage() {
  // Group tools by category
  const categories: ToolCategory[] = ['security', 'ai', 'dns', 'image', 'email'];
  
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Browse by Category</h1>
          <p className="text-gray-600 dark:text-gray-400">Find the right utility for your specific task.</p>
        </div>

        <div className="space-y-16">
          {categories.map((cat) => {
            const categoryTools = tools.filter(t => t.category === cat);
            if (categoryTools.length === 0) return null;

            return (
              <section key={cat} id={cat} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Tag size={20} />
                  </span>
                  <h2 className="text-2xl font-bold capitalize dark:text-white">{cat} Tools</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <Link 
                      key={tool.slug} 
                      href={`/tool/${tool.slug}`}
                      className="group bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <tool.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 dark:text-gray-100">{tool.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
