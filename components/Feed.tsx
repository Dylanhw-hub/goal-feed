'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { feedPosts, stories, FeedPost } from '@/data/content'
import FeedHeader from './FeedHeader'
import StoryBar from './StoryBar'
import StoryViewer from './StoryViewer'
import StatusPost from './StatusPost'
import PollPost from './PollPost'
import DebatePost from './DebatePost'
import BeforeAfterPost from './BeforeAfterPost'
import CreatePost from './CreatePost'

export default function Feed() {
  // Splash screen state
  const [splashDismissed, setSplashDismissed] = useState(false)

  // How many posts are currently visible (progressive reveal)
  const [visibleCount, setVisibleCount] = useState(0)
  const [started, setStarted] = useState(false)

  // Stories state
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set())
  const [unlockedStories, setUnlockedStories] = useState<Set<string>>(new Set(['story-intro']))
  const [activeStory, setActiveStory] = useState<string | null>(null)

  // Track interactive post completions
  const [completedPosts, setCompletedPosts] = useState<Set<string>>(new Set())

  const totalInteractive = feedPosts.filter(
    p => p.type === 'poll' || p.type === 'debate' || p.type === 'create'
  ).length
  const completedCount = completedPosts.size
  const progress = totalInteractive > 0 ? completedCount / totalInteractive : 0

  const handleStoryOpen = useCallback((storyId: string) => {
    setActiveStory(storyId)
  }, [])

  const handleStoryClose = useCallback(() => {
    if (activeStory) {
      setViewedStories(prev => new Set(prev).add(activeStory))

      // After first story, start showing posts
      if (activeStory === 'story-intro' && !started) {
        setStarted(true)
        // Reveal posts one by one with delays
        revealPosts(feedPosts.length)
      }

      // After recap story, if not already at create post
      if (activeStory === 'story-recap') {
        // Ensure all posts are visible including create
        setVisibleCount(feedPosts.length)
      }
    }
    setActiveStory(null)
  }, [activeStory, started])

  const revealPosts = (count: number) => {
    let i = 0
    const reveal = () => {
      i++
      setVisibleCount(i)
      if (i < count) {
        // Check if this post is interactive — pause revealing until completed
        const post = feedPosts[i - 1]
        if (post.type === 'poll' || post.type === 'debate') {
          // Don't auto-reveal next post — wait for interaction
          return
        }
        setTimeout(reveal, 300)
      }
    }
    setTimeout(reveal, 400)
  }

  const handlePostComplete = useCallback((postId: string) => {
    setCompletedPosts(prev => new Set(prev).add(postId))

    // Find this post's index
    const idx = feedPosts.findIndex(p => p.id === postId)
    if (idx >= 0 && idx + 1 < feedPosts.length) {
      // Reveal next posts
      const nextIdx = idx + 1
      let toReveal = nextIdx + 1 // Reveal the next post

      // Keep revealing non-interactive posts
      while (toReveal < feedPosts.length) {
        const nextPost = feedPosts[toReveal - 1]
        if (nextPost.type === 'poll' || nextPost.type === 'debate') {
          break
        }
        toReveal++
      }

      // Check if we're near the create post — unlock recap story
      const createIdx = feedPosts.findIndex(p => p.type === 'create')
      if (nextIdx >= createIdx - 1) {
        setUnlockedStories(prev => new Set(prev).add('story-recap'))
      }

      setTimeout(() => setVisibleCount(v => Math.max(v, toReveal)), 600)
    }
  }, [])

  const handlePublish = useCallback(() => {
    setCompletedPosts(prev => new Set(prev).add('post-create'))
  }, [])

  const visiblePosts = feedPosts.slice(0, visibleCount)
  const activeStoryData = stories.find(s => s.id === activeStory)

  return (
    <div className="min-h-dvh bg-black">
      {/* TikTok-style FYP splash intro */}
      <AnimatePresence>
        {!splashDismissed && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black overflow-hidden"
          >
            {/* Background — dark gradient simulating a video */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(160deg, #0a0a0a 0%, #111 30%, #0d1117 60%, #0a0a0a 100%)',
                }}
              />
              {/* Subtle animated color wash */}
              <motion.div
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 40% 50%, rgba(254,44,85,0.2) 0%, transparent 60%), radial-gradient(ellipse at 60% 60%, rgba(37,244,238,0.12) 0%, transparent 50%)',
                }}
              />
            </div>

            {/* Top bar — "Following | For You" */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-0 left-0 right-0 z-20 pt-12 pb-3"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/40 text-[15px] font-semibold">Following</span>
                <span className="text-white/10">|</span>
                <span className="text-white text-[15px] font-bold relative">
                  For You
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-white" />
                </span>
              </div>
            </motion.div>

            {/* Center — Big GoalFeed branding */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-3"
                style={{ fontSize: '5.5rem' }}
              >
                🎯
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-black tracking-tighter leading-[0.85] mb-3 text-center"
                style={{
                  fontSize: 'clamp(4.5rem, 18vw, 7rem)',
                  background: 'linear-gradient(135deg, #fe2c55 0%, #ff6b81 40%, #25f4ee 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(254,44,85,0.3)) drop-shadow(0 0 80px rgba(37,244,238,0.15))',
                }}
              >
                Goal<br />Feed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-white/60 text-base font-semibold tracking-wide uppercase"
              >
                Set goals that hit
              </motion.p>
            </div>

            {/* Right side — TikTok-style action icons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute right-3 bottom-[180px] z-20 flex flex-col items-center gap-5"
            >
              {/* Profile */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center text-lg ring-2 ring-black">
                  🎯
                </div>
                <div className="w-5 h-5 rounded-full bg-[#fe2c55] flex items-center justify-center -mt-2.5 border-2 border-black">
                  <span className="text-white text-[10px] font-bold leading-none">+</span>
                </div>
              </div>

              {/* Heart */}
              <div className="flex flex-col items-center gap-0.5">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ delay: 2, duration: 0.4 }}
                  className="text-2xl"
                >
                  ❤️
                </motion.div>
                <span className="text-white text-[11px] font-semibold">4.2K</span>
              </div>

              {/* Comment */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-2xl">💬</span>
                <span className="text-white text-[11px] font-semibold">847</span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-2xl">↗️</span>
                <span className="text-white text-[11px] font-semibold">Share</span>
              </div>
            </motion.div>

            {/* Bottom left — username & description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute left-4 right-16 bottom-[90px] z-20"
            >
              <p className="text-white font-bold text-[15px] mb-1">@goalfeed</p>
              <p className="text-white/80 text-[13px] leading-relaxed mb-2">
                Stop setting goals that fail. Learn the difference between a wish and a plan. 🎯
              </p>
              <p className="text-white/80 text-[13px] font-semibold">#goals #studytok #motivation #growthmindset</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px]">🎵</span>
                <p className="text-white/60 text-xs">original sound — goalfeed</p>
              </div>
            </motion.div>

            {/* Bottom CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[28px] left-0 right-0 z-30 flex justify-center"
            >
              <button
                onClick={() => setSplashDismissed(true)}
                className="px-12 py-3 rounded-full font-bold text-sm text-white active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #fe2c55, #25f4ee)',
                  boxShadow: '0 0 30px rgba(254,44,85,0.3), 0 0 60px rgba(37,244,238,0.15)',
                }}
              >
                Start scrolling →
              </button>
            </motion.div>

            {/* Bottom nav bar — fake TikTok nav */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 z-20 pb-1 pt-2 bg-black/60 backdrop-blur-sm border-t border-white/5"
            >
              <div className="flex items-end justify-around px-2 pb-1">
                <div className="flex flex-col items-center gap-0.5">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>
                  <span className="text-white text-[10px] font-semibold">Home</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-40">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><circle cx="11" cy="11" r="7" fill="none" stroke="white" strokeWidth="2"/><path d="M16 16l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="text-white text-[10px]">Discover</span>
                </div>
                <div className="flex flex-col items-center -mt-2">
                  <div className="w-10 h-7 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 rounded-lg bg-[#25f4ee] translate-x-[-3px]" />
                    <div className="absolute inset-0 rounded-lg bg-[#fe2c55] translate-x-[3px]" />
                    <div className="absolute inset-0 rounded-lg bg-white flex items-center justify-center">
                      <span className="text-black text-xl font-light leading-none">+</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-40">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                  <span className="text-white text-[10px]">Inbox</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-40">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span className="text-white text-[10px]">Me</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedHeader progress={progress} />

      <StoryBar
        stories={stories}
        viewedStories={viewedStories}
        unlockedStories={unlockedStories}
        onOpen={handleStoryOpen}
      />

      {/* Intro state — before first story */}
      {!started && splashDismissed && (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-6xl mb-4">👆</p>
            <h2 className="text-xl font-extrabold mb-2 text-white">
              Tap the story above to start
            </h2>
            <p className="text-sm text-white/40">
              Learn what makes goals work, then scroll the feed
            </p>
          </motion.div>
        </div>
      )}

      {/* Feed posts */}
      {started && (
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
          {visiblePosts.map((post, idx) => renderPost(post, idx, handlePostComplete, handlePublish))}

          {/* Completion message */}
          {completedPosts.has('post-create') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <p className="text-4xl mb-3">🎯</p>
              <h3 className="text-lg font-extrabold mb-1 text-white">You&apos;re set.</h3>
              <p className="text-sm text-white/40 max-w-xs mx-auto">
                Now you know the difference between a wish and a plan. Go make it happen.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Story viewer overlay */}
      <AnimatePresence>
        {activeStoryData && (
          <StoryViewer
            story={activeStoryData}
            onClose={handleStoryClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function renderPost(
  post: FeedPost,
  idx: number,
  onComplete: (id: string) => void,
  onPublish: (goal: string) => void,
) {
  const delay = idx * 0.05

  switch (post.type) {
    case 'status':
      return <StatusPost key={post.id} data={post} delay={delay} />
    case 'poll':
      return (
        <PollPost
          key={post.id}
          data={post}
          delay={delay}
          onVote={() => onComplete(post.id)}
        />
      )
    case 'debate':
      return (
        <DebatePost
          key={post.id}
          data={post}
          delay={delay}
          onAnswer={() => onComplete(post.id)}
        />
      )
    case 'beforeAfter':
      return <BeforeAfterPost key={post.id} data={post} delay={delay} />
    case 'create':
      return (
        <CreatePost
          key={post.id}
          delay={delay}
          onPublish={onPublish}
        />
      )
  }
}
