'use client'

import { characters } from '@/data/content'

interface AvatarProps {
  characterId: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
}

export default function Avatar({ characterId, size = 'md' }: AvatarProps) {
  const char = characters[characterId]
  if (!char) return null

  return (
    <div
      className="rounded-full p-[2.5px] shrink-0"
      style={{
        background: `linear-gradient(135deg, ${char.gradient[0]}, ${char.gradient[1]})`,
      }}
    >
      <div
        className={`${sizes[size]} rounded-full bg-[#111] flex items-center justify-center font-bold ring-2 ring-[#111]`}
      >
        {char.emoji}
      </div>
    </div>
  )
}
