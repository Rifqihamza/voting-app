import HeroPage from "./HeroPage/page"
import AboutPage from "./AboutPage/page"
import TutorialPage from "./TutorialPage/page"
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent"
import FooterComponent from "@/components/FooterComponent/FooterComponent"

export default function LayoutLand() {
    return (
        <main>
            <NavbarComponent />
            <HeroPage />
            <AboutPage />
            <TutorialPage />
            <FooterComponent />
        </main>
    )
}