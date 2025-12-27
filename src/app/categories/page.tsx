import Link from 'next/link';
import { tools, ToolCategory } from '@/lib/tools-config';
import { ArrowUpRight, Folder, Hash } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Module Directory // ProKit',
  description: 'Full index of available developer utilities.',
};

export default function CategoriesPage() {
  const categories: ToolCategory[] = ['security', 'ai', 'dns', 'image', 'dev'];
  
  return (
    <div className="min-h-screen bg-[var(--background)]">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--muted)]/10 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tighter text-[var(--foreground)] mb-4">
            Module Directory
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl text-lg font-light">
            Index of all active utilities. Categorized by function and runtime environment.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="space-y-20">
          
          {categories.map((cat, i) => {
            const categoryTools = tools.filter(t => t.category === cat);
            if (categoryTools.length === 0) return null;
            
            // Format category ID like "01_SECURITY"
            const catId = `${String(i + 1).padStart(2, '0')}_${cat.toUpperCase()}`;

            return (
              <section key={cat} id={cat} className="scroll-mt-24">
                
                {/* Category Header */}
                <div className="flex items-end gap-4 border-b border-[var(--foreground)] pb-4 mb-8">
                   <h2 className="text-xl font-mono font-bold text-[var(--foreground)] uppercase tracking-widest">
                     {catId}
                   </h2>
                   <span className="text-xs font-mono text-[var(--muted-foreground)] mb-1">
                     // {categoryTools.length} MODULES DETECTED
                   </span>
                </div>

                {/* Technical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)]">
                  {categoryTools.map((tool) => (
                    <Link 
                      key={tool.slug} 
                      href={`/tool/${tool.slug}`}
                      className="group flex flex-col justify-between bg-[var(--background)] p-6 hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                           <tool.icon className="w-8 h-8 text-[var(--foreground)] opacity-80" strokeWidth={1.5} />
                           <span className="text-[10px] font-mono text-[var(--muted-foreground)] border border-[var(--border)] px-1.5 py-0.5 rounded-sm">
                             v1.0
                           </span>
                        </div>
                        <h3 className="font-bold text-lg text-[var(--foreground)] mb-2 group-hover:underline decoration-1 underline-offset-4">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--border)] border-dashed">
                        <span className="text-xs font-mono text-[var(--muted-foreground)] uppercase">
                          {tool.category}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />
                      </div>
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
