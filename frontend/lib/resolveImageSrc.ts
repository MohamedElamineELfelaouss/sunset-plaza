/**
 * Resolves image source URL for backend images
 */
export function resolveImageSrc(src: string | null | undefined): string {
    if (!src) {
        return "/placeholder-office.jpg"
    }

    // If already a full URL, return as is
    if (src.startsWith("http://") || src.startsWith("https://")) {
        return src
    }

    // If relative path, prepend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    // Remove leading slash if present to avoid double slashes
    const cleanSrc = src.startsWith("/") ? src : `/${src}`

    return `${apiUrl}${cleanSrc}`
}

export default resolveImageSrc
