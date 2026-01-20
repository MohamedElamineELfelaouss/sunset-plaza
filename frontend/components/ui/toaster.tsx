"use client"

import { useToast } from "@/hooks/use-toast"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
    return (
        <SonnerToaster
            position="top-right"
            toastOptions={{
                classNames: {
                    toast:
                        "group rounded-xl border border-white/70 bg-white/95 backdrop-blur-xl text-plaza-900 shadow-luxury",
                    title: "font-semibold text-plaza-900",
                    description: "text-plaza-600",
                    actionButton: "bg-sunset-500 text-white hover:bg-sunset-600",
                    cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
                    success: "border-emerald-200 bg-emerald-50/95",
                    error: "border-red-200 bg-red-50/95",
                },
            }}
        />
    )
}
