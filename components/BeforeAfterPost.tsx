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
              <span className="text-xs text-white/30">{char.handle}</span>
            </div>
            <span className="text-xs text-white/30">{data.timeAgo}</span>
          </div>
        </div>

        {/* Before card */}
        <div className="rounded-xl overflow-hidden">
          <div className="bg-white/5 p-4 border border-white/10 rounded-t-xl">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wide">
              The goal
            </span>
            <p className="text-[15px] mt-1.5 leading-relaxed text-white/80">{data.before}</p>
          </div>

          {/* Reveal button / After card */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] text-white py-3.5 text-sm font-bold tracking-wide hover:brightness-110 active:scale-[0.99] transition-all"
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
                    ? 'bg-[#00f593]/8 border-[#00f593]/20'
                    : 'bg-[#fe2c55]/8 border-[#fe2c55]/20'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  data.isPositive ? 'text-[#00f593]' : 'text-[#fe2c55]'
                }`}>
                  {data.label}
                </span>
                <p className="text-[15px] mt-1.5 leading-relaxed text-white/80">{data.after}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PostCard>
  )
}
