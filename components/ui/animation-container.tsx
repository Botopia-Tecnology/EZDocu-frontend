"use client";

import { motion } from 'framer-motion';

interface AnimationContainerProps {
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    className?: string;
}

export function AnimationContainer({ children, className, reverse, delay = 0 }: AnimationContainerProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.4,
                delay,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}
