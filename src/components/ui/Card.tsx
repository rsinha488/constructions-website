import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className }: CardProps) => {
    return (
        <div className={cn('bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden', className)}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }: CardProps) => {
    return <div className={cn('px-6 py-4 border-b border-slate-50', className)}>{children}</div>;
};

export const CardTitle = ({ children, className }: CardProps) => {
    return <h3 className={cn('text-lg font-bold text-slate-900', className)}>{children}</h3>;
};

export const CardContent = ({ children, className }: CardProps) => {
    return <div className={cn('p-6', className)}>{children}</div>;
};

export const CardFooter = ({ children, className }: CardProps) => {
    return <div className={cn('px-6 py-4 bg-slate-50/50 border-t border-slate-50', className)}>{children}</div>;
};
