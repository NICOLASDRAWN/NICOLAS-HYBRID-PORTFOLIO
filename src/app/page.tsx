import { HeroSection } from "@/components/blocks/hero-section-9"
import { HeroFuturistic } from "@/components/blocks/hero-futuristic"
import { Profile } from "@/components/blocks/profile"
import { Skills } from "@/components/blocks/skills"
import { Experience } from "@/components/blocks/experience"
import { Projects } from "@/components/blocks/projects"
import { Contact } from "@/components/blocks/contact"

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />
      
      <div className="space-y-0">
        <HeroFuturistic />
        <Profile />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </div>
  )
}
