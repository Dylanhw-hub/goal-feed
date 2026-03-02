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
              <span className="text-xs text-gray-400">{char.handle}</span>
            </div>
            <span className="text-xs text-gray-400">{data.timeAgo}</span>
          </div>
        </div>

        {/* Hot take */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3.5 mb-4">
          <p className="text-[15px] leading-relaxed font-medium">
            {data.hotTake}
          </p>
        </div>

        {/* Instruction */}
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
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
                    ? 'border-transparent bg-gray-50 hover:bg-gray-100 active:scale-[0.98]'
                    : reply.isCorrect
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : isChosen
                        ? 'border-red-300 bg-red-50/30'
                        : 'border-transparent bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Avatar characterId={reply.characterId} size="sm" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold">{replyChar.name}</span>
                    <p className="text-sm leading-relaxed mt-0.5">{reply.text}</p>
                    {revealed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`inline-block mt-1.5 text-xs font-bold ${
                          reply.isCorrect ? 'text-emerald-600' : ''
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
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}>
                <span className="font-bold">
                  {data.replies[selected].isCorrect ? '🎯 Nice judgment!' : '🤔 Think about it —'}
                </span>{' '}
                {data.explanation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PostCard>
  )
}
