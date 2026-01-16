"use client";

import { useRef, useEffect, useState } from 'react';

interface AnimationContainerProps {
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    className?: string;
}

export function AnimationContainer({ children, className, reverse, delay = 0 }: AnimationContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : `translateY(${reverse ? '-20px' : '20px'})`,
                transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}
