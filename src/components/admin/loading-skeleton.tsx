/**
 * Loading Skeleton — reusable loading states
 */
"use client";

interface SkeletonProps {
    rows?: number;
    type?: "table" | "card" | "text";
    className?: string;
}

export default function LoadingSkeleton({ rows = 5, type = "table", className = "" }: SkeletonProps) {
    if (type === "card") {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
                {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-5 animate-pulse">
                        <div className="h-3 bg-gray-700 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-gray-700 rounded w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === "text") {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: rows }, (_, i) => (
                    <div key={i} className="h-3 bg-gray-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
            </div>
        );
    }

    // Table skeleton
    return (
        <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden ${className}`}>
            <div className="border-b border-gray-700 px-4 py-3 flex gap-6">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="h-3 bg-gray-700 rounded animate-pulse" style={{ width: `${50 + i * 15}px` }} />
                ))}
            </div>
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="border-b border-gray-700/50 px-4 py-3 flex gap-6 items-center">
                    <div className="h-3 bg-gray-700/60 rounded animate-pulse w-40" />
                    <div className="h-3 bg-gray-700/60 rounded animate-pulse w-20" />
                    <div className="h-3 bg-gray-700/60 rounded animate-pulse w-16" />
                    <div className="h-5 bg-gray-700/60 rounded-full animate-pulse w-16" />
                    <div className="h-3 bg-gray-700/60 rounded animate-pulse w-20" />
                </div>
            ))}
        </div>
    );
}

/**
 * Inline skeleton line
 */
export function SkeletonLine({ width = "w-20" }: { width?: string }) {
    return <div className={`h-3 bg-gray-700 rounded animate-pulse inline-block ${width}`} />;
}
