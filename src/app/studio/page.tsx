"use client"

import { useSearchParams } from "next/navigation"
import { StudioLayout } from "@/components/social/StudioLayout"
import { LetterN } from "@/components/social/LetterN"
import { Suspense } from "react"

function StudioContent() {
  const searchParams = useSearchParams()
  const format = (searchParams.get("format") as "post" | "story") || "post"

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-20">
      <div className="shadow-[0_0_100px_rgba(0,0,0,0.5)] scale-50 origin-center md:scale-75 lg:scale-100">
        <StudioLayout format={format}>
          <LetterN />
        </StudioLayout>
      </div>

      {/* Helper UI (Hidden during export via CSS) */}
      <div className="fixed top-8 right-8 flex flex-col gap-4 no-print sm:flex-row">
        <a 
          href="?format=post" 
          className={`px-6 py-2 font-mono text-xs border ${format === "post" ? "bg-acid text-bg" : "text-acid border-acid"} hover:bg-acid hover:text-bg transition-colors`}
        >
          POST 1:1
        </a>
        <a 
          href="?format=story" 
          className={`px-6 py-2 font-mono text-xs border ${format === "story" ? "bg-acid text-bg" : "text-acid border-acid"} hover:bg-acid hover:text-bg transition-colors`}
        >
          STORY 9:16
        </a>
      </div>
      
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
        }
        body { overflow: hidden; }
      `}</style>
    </main>
  )
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      <StudioContent />
    </Suspense>
  )
}
