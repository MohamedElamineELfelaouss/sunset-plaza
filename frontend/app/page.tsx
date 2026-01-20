import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import SpacesSection from "@/components/SpacesSection"
import AdvantagesSection from "@/components/AdvantagesSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import ChatWidget from "@/components/ChatWidget"

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <HeroSection />
            <SpacesSection />
            <AdvantagesSection />
            <ContactSection />
            <Footer />
            <ChatWidget />
        </main>
    )
}
