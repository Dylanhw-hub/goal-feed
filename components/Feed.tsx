'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
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
    <div className="min-h-dvh bg-[var(--color-feed-bg)]">
      <FeedHeader progress={progress} />

      <StoryBar
        stories={stories}
        viewedStories={viewedStories}
        unlockedStories={unlockedStories}
        onOpen={handleStoryOpen}
      />

      {/* Intro state — before first story */}
      {!started && (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-6xl mb-4">👆</p>
          <h2 className="text-xl font-extrabold mb-2">
            Tap the story above to start
          </h2>
          <p className="text-sm text-gray-400">
            Learn what makes goals work, then scroll the feed
          </p>
        </div>
      )}

      {/* Feed posts */}
      {started && (
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4 pb-24">
          {visiblePosts.map((post, idx) => renderPost(post, idx, handlePostComplete, handlePublish))}

          {/* Completion message */}
          {completedPosts.has('post-create') && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🎯</p>
              <h3 className="text-lg font-extrabold mb-1">You&apos;re set.</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                Now you know the difference between a wish and a plan. Go make it happen.
              </p>
            </div>
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
