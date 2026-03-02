'use client'

import { useState } from 'react'

interface ReactionBarProps {
  initialLikes?: number
  initialComments?: number
}

export default function ReactionBar({ initialLikes = 0, initialComments = 0 }: ReactionBarProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className="flex items-center gap-5 px-4 py-2.5">
      <button
        onClick={handleLike}
        className="flex items-center gap-1.5 text-sm group"
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <span className={`text-xl transition-transform ${liked ? 'heart-pop' : ''}`}>
          {liked ? '❤️' : '🤍'}
        </span>
        <span className={`font-medium ${liked ? 'text-red-500' : 'text-gray-500'}`}>
          {likes > 0 ? likes : ''}
        </span>
      </button>
      {initialComments > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span className="text-lg">💬</span>
          <span className="font-medium">{initialComments}</span>
        </div>
      )}
      <button className="flex items-center gap-1.5 text-sm text-gray-500 ml-auto" aria-label="Share">
        <span className="text-lg">📤</span>
      </button>
    </div>
  )
}
