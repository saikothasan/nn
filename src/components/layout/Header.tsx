import Link from 'next/link';
import { Cpu, Send } from 'lucide-react'; 

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
            <Cpu size={20} />
          </div>
          <span>ProKit<span className="text-blue-600">.uk</span></span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Tools</Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Telegram Promotion Button */}
          <Link 
            href="https://t.me/drkingbd" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Send size={14} className="-ml-0.5" />
            <span className="hidden sm:inline">Join Channel</span>
            <span className="sm:hidden">Join</span>
          </Link>

          <Link 
            href="https://github.com/saikothasan/nn" 
            target="_blank"
            className="hidden lg:block text-xs font-mono bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            Star on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}
