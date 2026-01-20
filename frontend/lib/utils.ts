import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "MAD"): string {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)
}

export function formatDate(date: string | Date, locale = "fr-FR"): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date))
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat("fr-FR").format(num)
}
