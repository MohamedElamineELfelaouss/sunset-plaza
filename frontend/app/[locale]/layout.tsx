import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { locales, type Locale } from '@/lib/i18n'
import '../globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params

    const titles: Record<Locale, string> = {
        fr: 'Sunset Plaza | Espaces de Bureaux Premium',
        en: 'Sunset Plaza | Premium Office Spaces',
        ar: 'صنسيت بلازا | مساحات مكتبية فاخرة',
        es: 'Sunset Plaza | Espacios de Oficinas Premium',
        nl: 'Sunset Plaza | Premium Kantoorruimtes',
        de: 'Sunset Plaza | Premium Büroflächen',
        it: 'Sunset Plaza | Spazi Ufficio Premium',
        pt: 'Sunset Plaza | Espaços de Escritório Premium',
    }

    const descriptions: Record<Locale, string> = {
        fr: 'Espaces de travail professionnels à Casablanca',
        en: 'Professional workspaces in Casablanca',
        ar: 'مساحات عمل احترافية في الدار البيضاء',
        es: 'Espacios de trabajo profesionales en Casablanca',
        nl: 'Professionele werkruimtes in Casablanca',
        de: 'Professionelle Arbeitsräume in Casablanca',
        it: 'Spazi di lavoro professionali a Casablanca',
        pt: 'Espaços de trabalho profissionais em Casablanca',
    }

    return {
        title: titles[locale] || titles.fr,
        description: descriptions[locale] || descriptions.fr,
    }
}

interface LocaleLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: Locale }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params

    // Validate locale
    if (!locales.includes(locale)) {
        notFound()
    }

    // Enable static rendering
    setRequestLocale(locale)

    // Get messages for current locale
    const messages = await getMessages()

    // RTL for Arabic
    const dir = locale === 'ar' ? 'rtl' : 'ltr'

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages}>
                        {children}
                        <Toaster />
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
