"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
    title?: string
    description?: string
    variant?: "default" | "success" | "error"
}

export function useToast() {
    const toast = ({ title, description, variant = "default" }: ToastProps) => {
        switch (variant) {
            case "success":
                sonnerToast.success(title, { description })
                break
            case "error":
                sonnerToast.error(title, { description })
                break
            default:
                sonnerToast(title, { description })
        }
    }

    return { toast }
}
