"use client"
import HeroPage from "./HomePage/HeroPage/page"
import AboutPage from "./HomePage/AboutPage/page"
import TutorialPage from "./HomePage/TutorialPage/page"
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
