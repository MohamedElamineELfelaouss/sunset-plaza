import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import SpacesSection from '@/components/SpacesSection'
import AdvantagesSection from '@/components/AdvantagesSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

interface HomePageProps {
    params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params

    // Enable static rendering
    setRequestLocale(locale)

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
