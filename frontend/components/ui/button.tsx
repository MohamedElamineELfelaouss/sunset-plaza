import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-[#f59e0b] text-white shadow-lg hover:bg-[#d97706] hover:shadow-xl hover:-translate-y-0.5",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-600",
                outline:
                    "border-2 border-[#f59e0b] text-[#d97706] bg-transparent hover:bg-[#f59e0b] hover:text-white",
                secondary:
                    "bg-[#0f172a] text-white shadow-lg hover:bg-[#1e293b] hover:-translate-y-0.5",
                ghost:
                    "hover:bg-slate-100 hover:text-slate-900",
                link:
                    "text-[#d97706] underline-offset-4 hover:underline",
                glass:
                    "bg-white/80 backdrop-blur-xl border border-white/50 text-[#0f172a] shadow-lg hover:bg-white/90",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-4 text-xs",
                lg: "h-14 rounded-xl px-8 text-base",
                xl: "h-16 rounded-2xl px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
