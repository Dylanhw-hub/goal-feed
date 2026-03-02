'use client'

interface FeedHeaderProps {
  progress: number
}

export default function FeedHeader({ progress }: FeedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight gradient-text">
          GoalFeed
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">
            {Math.round(progress * 100)}%
          </span>
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
