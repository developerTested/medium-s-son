import { classNames } from '@/utilities/helper';
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md';

type AlertProps = React.ButtonHTMLAttributes<HTMLDivElement> & {
    border?: "top" | "bottom" | "left" | "right",
    variant?: "success" | "danger" | "info" | "warning" | "default",
    title?: string,
    dense?: boolean,
    icon?: React.ReactNode,
    outlined?: boolean,
    closeIcon?: React.ReactNode,
    dismissible?: boolean,
}

export default function Alert({ children, border, title, outlined, variant = "default", color, dense, icon, closeIcon, ...props }: AlertProps) {

    const [dismissible, setDismissible] = useState(false)

    var alertClass = classNames(props.className, {
        alert: true,
        'alert-dense': dense,
        'alert-outline': outlined,
        [`alert-${variant}`]: variant,
        [`text-${color}`]: color,

    })

    const handleDismissible = () => setDismissible(true)

    if (dismissible) {
        return null;
    }

    return (
        <div className={alertClass}>
            {title ? <div className="alert-title text-4xl">{title}</div> : undefined}

            <div className="alert-body flex items-center justify-between">
                {icon ? <div className="alert-icon">
                    {icon}
                </div> : undefined}
                <div className="block space-y-4">
                    {children}
                </div>

                {closeIcon ? closeIcon : <button onClick={handleDismissible} className="alert-close btn p-0 bg-none">
                    <MdClose className="w-6 h-6" />
                </button>}

                {border ? <div className={`alert-border alert-border-${border}`}></div> : undefined}
            </div>
        </div>
    )
}