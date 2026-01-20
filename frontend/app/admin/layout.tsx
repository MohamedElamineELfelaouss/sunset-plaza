"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/Sidebar"
import { Loader2 } from "lucide-react"

// Context for sidebar state
interface SidebarContextType {
    isOpen: boolean
    openSidebar: () => void
    closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType>({
    isOpen: false,
    openSidebar: () => { },
    closeSidebar: () => { },
})

export function useSidebar() {
    return useContext(SidebarContext)
}

// Provider component
function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <SidebarContext.Provider value={{
            isOpen,
            openSidebar: () => setIsOpen(true),
            closeSidebar: () => setIsOpen(false),
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

// Auth guard component
function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setIsAuthenticated(true)
            return
        }

        // Check for token
        const token = localStorage.getItem('access_token') || localStorage.getItem('adminToken')
        const role = localStorage.getItem('user_role')

        if (!token) {
            router.replace('/admin/login')
            return
        }

        // Optional: Check if user is admin
        if (role && role !== 'ADMIN') {
            localStorage.clear()
            router.replace('/admin/login')
            return
        }

        setIsAuthenticated(true)
    }, [pathname, router])

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#C4A052] animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Login page has its own layout (no sidebar)
    if (pathname === '/admin/login') {
        return <AuthGuard>{children}</AuthGuard>
    }

    return (
        <AuthGuard>
            <SidebarProvider>
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </SidebarProvider>
        </AuthGuard>
    )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, closeSidebar } = useSidebar()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Sidebar */}
            <AdminSidebar
                isOpen={isOpen}
                onClose={closeSidebar}
            />

            {/* Main Content - Responsive padding */}
            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
