'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { characters, DebatePostData } from '@/data/content'
import Avatar from './Avatar'
import PostCard from './PostCard'

interface DebatePostProps {
  data: DebatePostData
  onAnswer?: () => void
  delay?: number
}

export default function DebatePost({ data, onAnswer, delay }: DebatePostProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const char = characters[data.characterId]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    onAnswer?.()
  }

  return (
    <PostCard delay={delay}>
      <div className="px-4 pt-4 pb-3">
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

        {/* Hot take */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-4">
          <p className="text-[15px] leading-relaxed font-medium text-white/90">
            {data.hotTake}
          </p>
        </div>

        {/* Instruction */}
        <p className="text-xs text-white/40 font-semibold uppercase tracking-wide mb-3">
          {selected === null ? '💬 Tap the reply you agree with' : '💬 Replies'}
        </p>

        {/* Comment replies */}
        <div className="space-y-2">
          {data.replies.map((reply, idx) => {
            const replyChar = characters[reply.characterId]
            const isChosen = selected === idx
            const revealed = selected !== null

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full text-left rounded-xl p-3 transition-all border-2 ${
                  !revealed
                    ? 'border-transparent bg-white/5 hover:bg-white/8 active:scale-[0.98]'
                    : reply.isCorrect
                      ? 'border-[#00f593]/50 bg-[#00f593]/8'
                      : isChosen
                        ? 'border-[#fe2c55]/40 bg-[#fe2c55]/5'
                        : 'border-transparent bg-white/5 opacity-40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Avatar characterId={reply.characterId} size="sm" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white/80">{replyChar.name}</span>
                    <p className="text-sm leading-relaxed mt-0.5 text-white/70">{reply.text}</p>
                    {revealed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`inline-block mt-1.5 text-xs font-bold ${
                          reply.isCorrect ? 'text-[#00f593]' : ''
                        }`}
                      >
                        {reply.isCorrect ? '✅ Strong take' : ''}
                      </motion.span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 p-3.5 rounded-xl text-sm leading-relaxed ${
                data.replies[selected].isCorrect
                  ? 'bg-[#00f593]/10 border border-[#00f593]/20'
                  : 'bg-[#fffc00]/8 border border-[#fffc00]/15'
              }`}>
                <span className="font-bold text-white">
                  {data.replies[selected].isCorrect ? '🎯 Nice judgment!' : '🤔 Think about it —'}
                </span>{' '}
                <span className="text-white/70">{data.explanation}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PostCard>
  )
}
