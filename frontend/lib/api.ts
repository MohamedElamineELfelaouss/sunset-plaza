import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor for auth token AND locale
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        // Add auth token if available
        const token = localStorage.getItem("authToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add Accept-Language header based on selected locale
        const locale = localStorage.getItem("NEXT_LOCALE") || "fr"
        config.headers["Accept-Language"] = locale
    }
    return config
})

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token on unauthorized
            if (typeof window !== "undefined") {
                localStorage.removeItem("authToken")
            }
        }
        return Promise.reject(error)
    }
)

export default api

// Type-safe API functions
export interface ContentImage {
    id: number
    image: string
    caption: string
    order: number
}

export interface ContentItem {
    id: number
    title: string
    description: string
    image?: string  // Legacy single image
    images?: ContentImage[]  // New: multiple images
    content_type: "NEWS" | "OFFICE"
    deal_type: "RENT" | "BUY" | "INVEST"
    price?: number
    surface_area?: number
    location?: string
    status: "DRAFT" | "PUBLISHED"
    created_at: string
    updated_at: string
}

export interface ContactRequest {
    name: string
    email: string
    phone: string
    request_type: "INFO" | "MEETING" | "INVESTMENT"
    message: string
}

export const contentApi = {
    getAll: () => api.get<ContentItem[]>("/api/content/"),
    getById: (id: number) => api.get<ContentItem>(`/api/content/${id}/`),
}

export const contactApi = {
    submit: (data: ContactRequest) => api.post("/api/contacts/", data),
}

export const chatApi = {
    ask: (question: string) => api.post<{ response: string }>("/api/chatbot/ask/", { question }),
}
