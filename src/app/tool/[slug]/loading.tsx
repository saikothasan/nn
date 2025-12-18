import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg max-w-sm mx-auto"></div>
        <div className="h-6 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-2xl mx-auto"></div>
      </div>

      {/* Tool Interface Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-medium">Loading Tool Environment...</span>
        </div>
      </div>
    </div>
  );
}
