'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Switch({
    checked,
    onChange,
    disabled = false,
    size = 'md',
    className,
}: SwitchProps) {
    const sizeStyles = {
        sm: {
            track: 'w-8 h-4',
            thumb: 'w-3 h-3',
            translate: 'translate-x-4',
        },
        md: {
            track: 'w-11 h-6',
            thumb: 'w-5 h-5',
            translate: 'translate-x-5',
        },
        lg: {
            track: 'w-14 h-7',
            thumb: 'w-6 h-6',
            translate: 'translate-x-7',
        },
    };

    const styles = sizeStyles[size];

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled) {
                    onChange(!checked);
                }
            }}
            className={cn(
                'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                styles.track,
                checked ? 'bg-purple-600' : 'bg-gray-200',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <span
                className={cn(
                    'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                    styles.thumb,
                    checked ? styles.translate : 'translate-x-0'
                )}
            />
        </button>
    );
}
