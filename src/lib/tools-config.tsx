import { 
  Cpu, 
  Lock, 
  Globe, 
  Mail, 
  Image as ImageIcon, 
  LucideIcon 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

// --- 1. Dynamic Component Imports ---
// This ensures the heavy code for tools is only loaded when the user visits that tool.

const BinChecker = dynamic(() => import('@/components/tools/security/BinChecker'), {
  loading: () => <ToolLoader name="BIN Checker" />,
});

// Placeholder for future tools (prevents errors for tools you haven't built yet)
const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
    <p className="text-lg font-medium">Tool Coming Soon</p>
    <p className="text-sm">We are currently building this feature.</p>
  </div>
);

// --- 2. Type Definitions ---

export type ToolCategory = 'ai' | 'security' | 'dns' | 'image' | 'email';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  component: React.ComponentType; // The actual React Component to render
}

// --- 3. Configuration ---

export const tools: Tool[] = [
  {
    slug: 'bin-checker',
    name: 'BIN Checker',
    description: 'Validate and retrieve details for any Bank Identification Number.',
    category: 'security',
    icon: Lock,
    keywords: ['bin lookup', 'credit card validator', 'bank identifier', 'payment security'],
    component: BinChecker,
  },
  {
    slug: 'ai-translator',
    name: 'AI Translator',
    description: 'Context-aware translation using Cloudflare Neural Networks.',
    category: 'ai',
    icon: Cpu,
    keywords: ['translation', 'ai language', 'polyglot', 'neural network'],
    component: ComingSoon, // Replace with actual component when built
  },
  {
    slug: 'dns-lookup',
    name: 'DNS Propagation',
    description: 'Check DNS records (A, MX, NS) across global nodes.',
    category: 'dns',
    icon: Globe,
    keywords: ['whois', 'dns check', 'mx records', 'domain propagation'],
    component: ComingSoon,
  },
  {
    slug: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Compress and resize images without losing quality.',
    category: 'image',
    icon: ImageIcon,
    keywords: ['image compression', 'webp converter', 'resize'],
    component: ComingSoon,
  },
];

// --- 4. Helper Functions ---

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);

export const getToolsByCategory = (category: ToolCategory) => 
  tools.filter((t) => t.category === category);

// --- 5. Internal Components ---

function ToolLoader({ name }: { name: string }) {
  return (
    <div className="p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <div className="text-gray-400 font-medium">Loading {name}...</div>
    </div>
  );
}
