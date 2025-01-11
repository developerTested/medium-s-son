import React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

type props = {
    color?: string,
    theme?: string,
    className?: string,
    size?: number,
    thickness?: number,
    value?: number,
    max?: number,
    remain?: number,
    text?: React.ReactNode | number | string,
}

export default function CircularProgressBar(props: props) {
    const { className, size = 40, thickness = 3.6, value = 0, remain = 10, color, text = 100, theme } = props;

    const circumference = 2 * Math.PI * ((size - thickness) / 2);
    const strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;

    const svgClass = twMerge(classNames(color, {
        '-rotate-90': true,
        'text-orange-400': remain < 30,
        'text-red-500': remain < 20,
    }));    

    return (
        <div className="relative bg-transparent flex items-center justify-center">
            <svg viewBox={`${size / 2} ${size / 2} ${size} ${size}`} width={size} height={size} className={svgClass}>
                <circle
                    className={className}
                    stroke={theme === 'light' ? "#ddd" : "#333"}
                    strokeDasharray={circumference.toFixed(3)}
                    strokeDashoffset={0}
                    r={(size - thickness) / 2}
                    fill="none"
                    strokeWidth={thickness}
                    cx={size}
                    cy={size}
                />
                <circle
                    className="transition-all"
                    stroke="currentColor"
                    strokeDasharray={circumference.toFixed(3)}
                    strokeDashoffset={strokeDashoffset}
                    r={(size - thickness) / 2}
                    fill="none"
                    strokeWidth={thickness}
                    cx={size}
                    cy={size}
                />
            </svg>
            <div className="text-sm absolute flex items-center justify-center w-full h-full top-0 left-0 right-0 bottom-0">
                {text}
            </div>
        </div>
    );
}
