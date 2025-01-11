import React from "react"
import { twMerge } from "tailwind-merge"

type LogoProps = React.HtmlHTMLAttributes<HTMLDivElement>

export default function Logo({ className }: LogoProps) {
  return (
    <div className={twMerge("font-bold text-2xl", className)}>Medium</div>
  )
}
