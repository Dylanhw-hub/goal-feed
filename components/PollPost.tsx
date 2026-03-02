'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { characters, PollPostData } from '@/data/content'
import Avatar from './Avatar'
import PostCard from './PostCard'

interface PollPostProps {
  data: PollPostData
  onVote?: () => void
  delay?: number
}

export default function PollPost({ data, onVote, delay }: PollPostProps) {
  const [voted, setVoted] = useState<number | null>(null)
  const char = characters[data.characterId]

  // Simulate realistic vote distribution
  const fakePercents = data.correctIndex === 1 ? [28, 72] : [72, 28]

  const handleVote = (index: number) => {
    if (voted !== null) return
    setVoted(index)
    onVote?.()
  }

  const isCorrect = voted === data.correctIndex

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

        {/* Question */}
        <p className="text-[15px] leading-relaxed whitespace-pre-line mb-4">
          {data.question}
        </p>

        {/* Poll options */}
        <div className="space-y-2.5">
          {data.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={voted !== null}
              className={`w-full relative rounded-xl border-2 text-left transition-all overflow-hidden ${
                voted === null
                  ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 active:scale-[0.98]'
                  : voted === idx
                    ? idx === data.correctIndex
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-red-300 bg-red-50/30'
                    : idx === data.correctIndex
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-gray-100 opacity-60'
              }`}
            >
              {/* Background fill bar */}
              {voted !== null && (
                <div
                  className={`absolute inset-y-0 left-0 poll-bar-fill rounded-xl ${
                    idx === data.correctIndex ? 'bg-emerald-100/80' : 'bg-gray-100/80'
                  }`}
                  style={{ width: `${fakePercents[idx]}%` }}
                />
              )}

              <div className="relative z-10 px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{option}</span>
                {voted !== null && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm font-bold shrink-0"
                  >
                    {fakePercents[idx]}%
                  </motion.span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Vote count */}
        {voted !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 mt-2"
          >
            {data.totalVotes.toLocaleString()} votes
          </motion.p>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {voted !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 p-3.5 rounded-xl text-sm leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}>
                <span className="font-bold">
                  {isCorrect ? '✅ You got it!' : '🤔 Not quite —'}
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
