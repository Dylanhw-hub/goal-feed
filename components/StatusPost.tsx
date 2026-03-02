'use client'

import { characters, StatusPostData } from '@/data/content'
import Avatar from './Avatar'
import PostCard from './PostCard'
import ReactionBar from './ReactionBar'

interface StatusPostProps {
  data: StatusPostData
  delay?: number
}

export default function StatusPost({ data, delay }: StatusPostProps) {
  const char = characters[data.characterId]

  return (
    <PostCard delay={delay}>
      <div className="px-4 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar characterId={data.characterId} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm truncate">{char.name}</span>
              <span className="text-white/30 text-xs">{char.handle}</span>
            </div>
            <span className="text-xs text-white/30">{data.timeAgo}</span>
          </div>
        </div>

        {/* Body */}
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-white/90">
          {data.text}
        </p>
      </div>

      <ReactionBar initialLikes={data.likes} initialComments={data.comments} />
    </PostCard>
  )
}
