import { getInitials } from "@/utilities/helper";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const avatarStyles = cva('flex items-center justify-center bg-slate-200 shrink-0', {
  variants: {
    size: {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      normal: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
      xl: 'w-32 h-32',
      '2xl': 'w-48 h-48',
      '3xl': 'w-60 h-60',
      '4xl': 'w-96 h-96',
    }
  },
  defaultVariants: {
    size: 'normal',
  }
})

export type AvatarProps = VariantProps<typeof avatarStyles> & {
  src?: string;
  alt?: string;
  rounded?: boolean,
  className?: string,
  imageClassName?: string,
}

export default function Avatar({
  src,
  alt,
  size,
  rounded = true,
  className,
  imageClassName,
}: AvatarProps) {

  const avatarClass = twMerge(avatarStyles({ size }), `${rounded ? "rounded-full" : undefined}`, className)

  return (
    <div className={avatarClass}>
      {src ?
        <img src={src} alt={getInitials(alt ?? '')} className={twMerge(`w-full h-full object-cover ${rounded ? 'rounded-full' : ''}`, imageClassName)} /> : <div className="font-semibold">{getInitials(alt ?? '')}</div>}
    </div>
  )
}