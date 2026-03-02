'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostCard from './PostCard'

interface CreatePostProps {
  onPublish?: (goal: string) => void
  delay?: number
}

interface FeedbackChip {
  label: string
  met: boolean
}

function analyzeGoal(text: string): FeedbackChip[] {
  const lower = text.toLowerCase()
  const chips: FeedbackChip[] = []

  // Check for specific action (what)
  const actionWords = ['practice', 'do', 'complete', 'read', 'write', 'study', 'solve', 'review', 'attend', 'ask', 'submit', 'finish', 'make']
  const hasAction = actionWords.some(w => lower.includes(w))
  chips.push({ label: 'Specific action', met: hasAction })

  // Check for frequency/quantity (how often / how many)
  const freqPatterns = /\d+|every|daily|weekly|each|per week|per day|times|twice|once|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?|weekend/i
  const hasFrequency = freqPatterns.test(text)
  chips.push({ label: 'Frequency / amount', met: hasFrequency })

  // Check for deadline (by when)
  const deadlinePatterns = /by |before |until |end of|june|july|august|september|october|november|december|january|february|march|april|may|next week|next month|this term|term \d|exam/i
  const hasDeadline = deadlinePatterns.test(text)
  chips.push({ label: 'Deadline', met: hasDeadline })

  // Check for accountability (who)
  const accountabilityPatterns = /mr |ms |mrs |miss |teacher|tutor|friend|partner|parent|mom|dad|coach|mentor|with |help from/i
  const hasAccountability = accountabilityPatterns.test(text)
  chips.push({ label: 'Accountability', met: hasAccountability })

  return chips
}

export default function CreatePost({ onPublish, delay }: CreatePostProps) {
  const [text, setText] = useState('')
  const [published, setPublished] = useState(false)

  const chips = useMemo(() => analyzeGoal(text), [text])
  const metCount = chips.filter(c => c.met).length
  const allMet = metCount === chips.length

  const handlePublish = () => {
    if (text.trim().length < 10) return
    setPublished(true)
    onPublish?.(text)
  }

  if (published) {
    return (
      <PostCard delay={delay}>
        <div className="p-4">
          {/* Published post */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#111]">
              You
            </div>
            <div>
              <span className="font-bold text-sm">You</span>
              <span className="text-xs text-white/30 ml-2">just now</span>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed whitespace-pre-line mb-3 text-white/90">{text}</p>

          {/* Score chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  chip.met
                    ? 'bg-[#00f593]/15 text-[#00f593]'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {chip.met ? '✓' : '○'} {chip.label}
              </span>
            ))}
          </div>

          {/* Feedback message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-3.5 rounded-xl text-sm leading-relaxed ${
              allMet
                ? 'bg-[#00f593]/10 border border-[#00f593]/20'
                : metCount >= 2
                  ? 'bg-[#fffc00]/8 border border-[#fffc00]/15'
                  : 'bg-[#fe2c55]/8 border border-[#fe2c55]/15'
            }`}
          >
            {allMet ? (
              <><span className="font-bold text-white">🔥 This goal is fire.</span> <span className="text-white/70">You nailed all four elements — specific action, frequency, deadline, and accountability. This is a goal that drives real change.</span></>
            ) : metCount >= 2 ? (
              <><span className="font-bold text-white">💪 Solid start!</span> <span className="text-white/70">You hit {metCount} of 4 elements. Try adding {chips.filter(c => !c.met).map(c => c.label.toLowerCase()).join(' and ')} to make it even stronger.</span></>
            ) : (
              <><span className="font-bold text-white">🤔 You can level this up.</span> <span className="text-white/70">Right now it&apos;s more of a wish than a plan. Try making it more specific — what exactly will you do, how often, and by when?</span></>
            )}
          </motion.div>

          {/* Fake reactions from characters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-sm">❤️ 🔥 💪</span>
            <span className="text-xs text-white/30">
              Rea, Naledi, and {allMet ? '47 others' : '12 others'} reacted
            </span>
          </motion.div>
        </div>
      </PostCard>
    )
  }

  return (
    <PostCard delay={delay}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center text-white text-sm font-bold">
            You
          </div>
          <span className="text-sm font-bold text-white/40">Your turn</span>
        </div>

        <p className="text-sm text-white/50 mb-3">
          Post your own goal. Make it real — specific action, frequency, deadline, accountability.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your goal here... (e.g., 'Practice 5 stoichiometry problems every Tuesday and Thursday, review with Ms Nkosi on Fridays, target 60% by June exams')"
          className="w-full min-h-[120px] p-3.5 rounded-xl border-2 border-white/10 bg-white/5 focus:border-[#fe2c55]/50 focus:ring-0 outline-none resize-none text-[15px] leading-relaxed placeholder:text-white/20 transition-colors text-white/90"
        />

        {/* Live feedback chips */}
        <AnimatePresence>
          {text.length > 5 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 mt-3">
                {chips.map((chip) => (
                  <motion.span
                    key={chip.label}
                    layout
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      chip.met
                        ? 'bg-[#00f593]/15 text-[#00f593]'
                        : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {chip.met ? '✓' : '○'} {chip.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handlePublish}
          disabled={text.trim().length < 10}
          className="mt-3 w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #fe2c55, #25f4ee)',
          }}
        >
          Post your goal
        </button>
      </div>
    </PostCard>
  )
}
