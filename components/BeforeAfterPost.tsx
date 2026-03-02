'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { characters, BeforeAfterPostData } from '@/data/content'
import Avatar from './Avatar'
import PostCard from './PostCard'

interface BeforeAfterPostProps {
  data: BeforeAfterPostData
  delay?: number
}

export default function BeforeAfterPost({ data, delay }: BeforeAfterPostProps) {
  const [revealed, setRevealed] = useState(false)
  const char = characters[data.characterId]

  return (
    <PostCard delay={delay}>
      <div className="px-4 pt-4 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar characterId={data.characterId} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">{char.name}</span>
              <span className="text-xs text-gray-400">{char.handle}</span>
            </div>
            <span className="text-xs text-gray-400">{data.timeAgo}</span>
          </div>
        </div>

        {/* Before card */}
        <div className="rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-t-xl">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              The goal
            </span>
            <p className="text-[15px] mt-1.5 leading-relaxed">{data.before}</p>
          </div>

          {/* Reveal button / After card */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 text-sm font-bold tracking-wide hover:brightness-110 active:scale-[0.99] transition-all"
            >
              TAP TO SEE WHAT HAPPENED → {data.label}
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`p-4 border-x border-b rounded-b-xl ${
                  data.isPositive
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  data.isPositive ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {data.label}
                </span>
                <p className="text-[15px] mt-1.5 leading-relaxed">{data.after}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PostCard>
  )
}
