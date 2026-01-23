'use client';

import { ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'bg-red-100',
            iconColor: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: 'bg-amber-100',
            iconColor: 'text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 text-white',
        },
        info: {
            icon: 'bg-blue-100',
            iconColor: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${styles.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 -mr-2 -mt-2"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            {message}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        className={styles.button}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
