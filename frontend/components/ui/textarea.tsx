import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[120px] w-full rounded-xl border border-input bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-plaza-900 shadow-sm transition-all duration-200",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "resize-none",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
