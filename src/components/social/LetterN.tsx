"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

export const LetterN = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* The Giant N */}
        <span className="text-[500px] font-bold leading-none tracking-tighter text-ink select-none relative z-10">
          N<span className="text-acid">.</span>
        </span>

        {/* Glitch Shadow Effect */}
        <motion.span 
          animate={{ 
            x: [-2, 2, -1, 0], 
            opacity: [0.5, 0.2, 0.5, 0],
            skewX: [0, 10, -5, 0]
          }}
          transition={{ 
            duration: 0.4, 
            repeat: Infinity, 
            repeatDelay: 2,
            ease: "linear"
          }}
          className="absolute inset-0 text-[500px] font-bold leading-none tracking-tighter text-acid select-none z-0 translate-x-1"
        >
          N.
        </motion.span>

        {/* Scanline Effect */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-acid shadow-[0_0_15px_var(--color-acid)] z-20 opacity-50"
        />

        {/* Glitch Overlay (Noise) */}
        <motion.div 
          animate={{ opacity: [0, 0.05, 0, 0.1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 pointer-events-none z-30 bg-acid/10 mix-blend-overlay"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(198,255,61,0.1) 1px, rgba(198,255,61,0.1) 2px)" }}
        />

        {/* Technical Subtitle */}
        <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center gap-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
            className="h-[1px] bg-acid/30"
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-mono text-xl text-acid tracking-[0.2em] uppercase"
          >
            Engineering <span className="text-ink">Design</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Background Pulse Circle */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[800px] h-[800px] rounded-full border border-acid/20 pointer-events-none z-[-1]"
      />
    </div>
  )
}
