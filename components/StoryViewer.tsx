'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoryData } from '@/data/content'

interface StoryViewerProps {
  story: StoryData
  onClose: () => void
}

export default function StoryViewer({ story, onClose }: StoryViewerProps) {
  const [current, setCurrent] = useState(0)
  const slide = story.slides[current]

  const goNext = useCallback(() => {
    if (current < story.slides.length - 1) {
      setCurrent(prev => prev + 1)
    } else {
      onClose()
    }
  }, [current, story.slides.length, onClose])

  const goPrev = useCallback(() => {
    if (current > 0) setCurrent(prev => prev - 1)
  }, [current])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
        {story.slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                idx < current
                  ? 'bg-white w-full'
                  : idx === current
                    ? 'bg-white story-progress-fill'
                    : ''
              }`}
              key={idx === current ? `active-${current}` : undefined}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-10 right-4 z-20 text-white/80 hover:text-white text-2xl font-light"
        aria-label="Close story"
      >
        ✕
      </button>

      {/* Tap zones */}
      <div className="story-tap-left" onClick={goPrev} />
      <div className="story-tap-right" onClick={goNext} />

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${slide.bg[0]}, ${slide.bg[1]})`,
          }}
        >
          <span className="text-6xl mb-6">{slide.emoji}</span>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">
            {slide.title}
          </h2>
          <p className="text-lg opacity-90 max-w-sm leading-relaxed">
            {slide.text}
          </p>
          <p className="absolute bottom-8 text-xs opacity-50">
            Tap to continue
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
