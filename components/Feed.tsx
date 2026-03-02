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
      {/* TikTok-style splash intro */}
      <AnimatePresence>
        {!splashDismissed && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, #fe2c55 0%, transparent 50%), radial-gradient(circle at 70% 80%, #25f4ee 0%, transparent 50%)',
                }}
              />
              {/* Floating particles */}
              <motion.div
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[20%] left-[15%] w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(254,44,85,0.15) 0%, transparent 70%)' }}
              />
              <motion.div
                animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[25%] right-[10%] w-40 h-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(37,244,238,0.12) 0%, transparent 70%)' }}
              />
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center px-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl mb-6"
              >
                🎯
              </motion.div>

              <h1
                className="text-4xl font-extrabold tracking-tight mb-3"
                style={{
                  background: 'linear-gradient(135deg, #fe2c55, #ff6b81, #25f4ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GoalFeed
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-white/50 text-base mb-2 max-w-[280px]"
              >
                Learn to set goals that actually work
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-white/30 text-xs mb-10"
              >
                Scroll. React. Learn.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSplashDismissed(true)}
                className="relative px-10 py-3.5 rounded-full font-bold text-sm text-white overflow-hidden active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #fe2c55, #25f4ee)',
                }}
              >
                <span className="relative z-10">Start scrolling</span>
              </motion.button>
            </motion.div>

            {/* Bottom hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ delay: 2, duration: 3, repeat: Infinity }}
              className="absolute bottom-8 text-xs text-white/30"
            >
              swipe up
            </motion.p>
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
