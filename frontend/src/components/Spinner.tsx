import { VariantProps, cva } from 'class-variance-authority';
import React from 'react'
import { twMerge } from 'tailwind-merge';


const spinnerClasses = cva(
    ["flex", "items-center", "justify-center", "animate-spin", "-ml-1", "mr-3", "text-white"],
    {
        variants: {
            size: {
                default: ["w-6 h-6"],
                xs: ["w-4 h-4"],
                sm: ["w-5 h-5"],
                md: ["w-8 h-8"],
                lg: ["w-12 h-12"],
                xl: ["w-20 h-20"],
            },
            color: {
                default: "text-inherit",
                primary: "text-blue-500",
                success: "text-green-500",
                danger: "text-red-500"
            }
        },
        defaultVariants: {
            size: "default",
            color: "default",
        },
    }
);

type spinnerType = VariantProps<typeof spinnerClasses> & React.HtmlHTMLAttributes<HTMLDivElement>

export default function Spinner({ size, color, className, ...props }: spinnerType) {
    return (
        <div {...props}
            className={twMerge(spinnerClasses({ color, size }), className)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )
}
