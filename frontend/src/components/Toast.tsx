import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 50));
                if (newProgress <= 0) {
                    clearInterval(interval);
                    setIsExiting(true);
                    setTimeout(() => onClose(id), 300);
                    return 0;
                }
                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [duration, id, onClose]);

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    const colors = {
        success: 'from-green-500 to-emerald-600',
        error: 'from-red-500 to-rose-600',
        info: 'from-blue-500 to-indigo-600',
        warning: 'from-yellow-500 to-orange-600',
    };

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    };

    const textColors = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200',
        info: 'text-blue-800 dark:text-blue-200',
        warning: 'text-yellow-800 dark:text-yellow-200',
    };

    return (
        <div
            className={`
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        ${bgColors[type]}
        border rounded-lg shadow-lg p-4 mb-3 min-w-[300px] max-w-md
        backdrop-blur-sm transition-all duration-300
      `}
        >
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${colors[type]} flex items-center justify-center text-white font-bold text-sm`}>
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <p className={`${textColors[type]} font-medium text-sm`}>{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(() => onClose(id), 300);
                    }}
                    className={`${textColors[type]} hover:opacity-70 transition-opacity`}
                >
                    ✕
                </button>
            </div>
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colors[type]} transition-all duration-50 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Toast;
