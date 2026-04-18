import { HeroSection } from "@/components/blocks/hero-section-9"
import { HeroFuturistic } from "@/components/blocks/hero-futuristic"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HeroFuturistic />
      {/* Las demás secciones se irán construyendo aquí migrando desde legacy-html/index.html */}
    </main>
  )
}
