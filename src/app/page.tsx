import { Topbar } from "@/components/blocks/topbar"
import { HeroFuturistic } from "@/components/blocks/hero-futuristic"
import { Profile } from "@/components/blocks/profile"
import { Skills } from "@/components/blocks/skills"
import { Experience } from "@/components/blocks/experience"
import { Projects } from "@/components/blocks/projects"
import { Contact } from "@/components/blocks/contact"

export default function Home() {
  return (
    <div className="bg-bg min-h-screen">
      <Topbar />
      <main>
        <HeroFuturistic />
        <Profile />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
