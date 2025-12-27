import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { type ToastType } from './Toast';

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
