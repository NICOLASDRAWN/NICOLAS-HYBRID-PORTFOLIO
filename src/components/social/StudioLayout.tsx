"use client"

import React from "react"
import { motion } from "framer-motion"

interface StudioLayoutProps {
  children: React.ReactNode
  format: "post" | "story"
  className?: string
}

export const StudioLayout = ({ children, format, className }: StudioLayoutProps) => {
  const dimensions = format === "post" 
    ? "w-[1080px] h-[1080px]" 
    : "w-[1080px] h-[1920px]"

  return (
    <div 
      className={`relative bg-bg overflow-hidden flex items-center justify-center ${dimensions} ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Background Grid - Using existing Tailwind patterns from globals.css */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(var(--color-acid) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-acid) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }} 
      />

      {/* Brand Watermark / Metadata */}
      <div className="absolute top-12 left-12 flex items-center gap-4 font-mono text-xs tracking-widest text-ink-dim uppercase">
        <div className="w-2 h-2 rounded-full bg-acid shadow-[0_0_10px_var(--color-acid)]" />
        <span>NICOLASDRAWN // STUDIO v1.0</span>
        <span className="text-acid ml-4 opacity-70">● LIVE_SYSTEM</span>
      </div>

      <div className="absolute top-12 right-12 flex flex-col items-end font-mono text-[9px] text-acid/50 leading-relaxed uppercase">
        <div>LOC: 4.7110° N, 74.0721° W</div>
        <div>SYS_STATUS: OPTIMIZED</div>
        <div>TEMP: 24°C // STABLE</div>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between font-mono text-[10px] text-ink-dim uppercase tracking-widest">
        <div>FORMAT: {format.toUpperCase()} / 1080px</div>
        <div>REV: 2026.04.18 // BOGOTA</div>
      </div>

      <div className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[8px] text-ink-dim uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 opacity-50">
        BUILD - SHIP - REPEAT - BUILD - SHIP - REPEAT
      </div>

      {children}
    </div>
  )
}
