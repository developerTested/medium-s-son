import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string,
}

export default forwardRef(function TextInput({ className, type = 'text', ...props }: InputProps, ref: any) {
    return (
        <input
            {...props}
            ref={ref}
            type={type}
            className={
                twMerge("w-full px-4 py-2 disabled:cursor-not-allowed bg-white dark:bg-white/20 border border-gray-300 dark:border-none outline-none rounded-md", className)
            }
        />
    )
})