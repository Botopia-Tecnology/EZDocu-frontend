"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

interface GridBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

export function GridBackground({ children, className }: GridBackgroundProps) {
    const id = useId();

    return (
        <div className={cn("relative w-full", className)}>
            {/* Grid pattern */}
            <div className="absolute inset-0 w-full h-full">
                <svg
                    aria-hidden="true"
                    className="pointer-events-none w-full h-full fill-gray-200/50 stroke-gray-200/80"
                >
                    <defs>
                        <pattern
                            id={id}
                            width={40}
                            height={40}
                            patternUnits="userSpaceOnUse"
                            x={-1}
                            y={-1}
                        >
                            <path
                                d={`M.5 40V.5H40`}
                                fill="none"
                                strokeDasharray={0}
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
                </svg>
            </div>
            {/* Radial gradient mask to fade the grid */}
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
                <svg
                    aria-hidden="true"
                    className="pointer-events-none w-full h-full fill-gray-200/50 stroke-gray-200/80"
                >
                    <defs>
                        <pattern
                            id={`${id}-2`}
                            width={40}
                            height={40}
                            patternUnits="userSpaceOnUse"
                            x={-1}
                            y={-1}
                        >
                            <path
                                d={`M.5 40V.5H40`}
                                fill="none"
                                strokeDasharray={0}
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id}-2)`} />
                </svg>
            </div>
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
