'use client'

import { characters, StoryData } from '@/data/content'
import Avatar from './Avatar'

interface StoryBarProps {
  stories: StoryData[]
  viewedStories: Set<string>
  unlockedStories: Set<string>
  onOpen: (storyId: string) => void
}

export default function StoryBar({ stories, viewedStories, unlockedStories, onOpen }: StoryBarProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-lg mx-auto flex gap-4 overflow-x-auto">
        {stories.map((story) => {
          const char = characters[story.characterId]
          const viewed = viewedStories.has(story.id)
          const unlocked = unlockedStories.has(story.id)

          return (
            <button
              key={story.id}
              onClick={() => unlocked && onOpen(story.id)}
              disabled={!unlocked}
              className={`flex flex-col items-center gap-1 shrink-0 transition-all ${
                !unlocked ? 'opacity-30 grayscale' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <div
                className="rounded-full p-[2.5px]"
                style={{
                  background: viewed
                    ? '#d1d5db'
                    : `linear-gradient(135deg, ${char.gradient[0]}, ${char.gradient[1]})`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl ring-2 ring-white">
                  {char.emoji}
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-500 max-w-[64px] truncate">
                {story.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
