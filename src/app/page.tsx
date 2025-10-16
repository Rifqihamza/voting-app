"use client"
import HeroPage from "./home/HeroPage/page"
import AboutPage from "./home/AboutPage/page"
import TutorialPage from "./home/TutorialPage/page"
export default function Apps() {
  return (
    <>
      <main>
        <HeroPage />
        <AboutPage />
        <TutorialPage />
      </main>
    </>
  )
}
