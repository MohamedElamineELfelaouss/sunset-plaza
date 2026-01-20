import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/lib/i18n"
import { VisitorTracker } from "@/hooks/useVisitorTracking"
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
})

export const metadata: Metadata = {
    metadataBase: new URL('https://sunsetplaza.ma'),
    title: {
        default: "Sunset Plaza | Espaces de Bureaux Premium à Casablanca",
        template: "%s | Sunset Plaza"
    },
    description: "Découvrez nos espaces de bureaux haut de gamme à Casablanca. Location et vente de bureaux modernes, open spaces et locaux commerciaux dans un immeuble premium.",
    keywords: ["bureaux Casablanca", "location bureau", "immobilier professionnel", "espace de travail", "coworking Casablanca", "investissement immobilier Maroc", "Sunset Plaza"],
    authors: [{ name: "Sunset Plaza" }],
    creator: "Sunset Plaza",
    publisher: "Sunset Plaza",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: "https://sunsetplaza.ma",
        siteName: "Sunset Plaza",
        title: "Sunset Plaza | Espaces de Bureaux Premium à Casablanca",
        description: "Découvrez nos espaces de bureaux haut de gamme à Casablanca. Location et vente de bureaux modernes dans un immeuble premium.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Sunset Plaza - Bureaux Premium Casablanca",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sunset Plaza | Bureaux Premium Casablanca",
        description: "Espaces de bureaux haut de gamme à Casablanca. Location et vente.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: {
        canonical: "https://sunsetplaza.ma",
        languages: {
            'fr-FR': 'https://sunsetplaza.ma',
            'en-US': 'https://sunsetplaza.ma/en',
        },
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <I18nProvider>
                        <VisitorTracker />
                        {children}
                        <Toaster />
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

