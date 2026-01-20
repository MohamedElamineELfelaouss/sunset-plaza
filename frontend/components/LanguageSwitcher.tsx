"use client"

import { Globe } from 'lucide-react'
import { useLocale, locales, languageInfo, type Locale } from '@/lib/i18n'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLocale()

    const handleChange = (newLocale: string) => {
        setLocale(newLocale as Locale)
    }

    const currentLang = languageInfo[locale]

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-auto gap-2 border-none bg-transparent hover:bg-white/50 px-3">
                <Globe className="h-4 w-4 text-slate-600" />
                <SelectValue>
                    <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
                    <span className="sm:hidden">{currentLang.flag}</span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
                {locales.map((code) => (
                    <SelectItem key={code} value={code}>
                        <span className="flex items-center gap-2">
                            <span>{languageInfo[code].flag}</span>
                            <span>{languageInfo[code].label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
