'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PostCardProps {
  children: ReactNode
  delay?: number
}

export default function PostCard({ children, delay = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden"
    >
      {children}
    </motion.article>
  )
}
