'use client';

import React, { useEffect } from 'react';

interface ThemeProviderProps {
    readonly branding: {
        readonly primaryColor: string;
        readonly secondaryColor: string;
        readonly accentColor: string;
        readonly fontFamily: string;
    };
    readonly children: React.ReactNode;
}

export default function ThemeProvider({ branding, children }: ThemeProviderProps) {
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', branding.primaryColor);
        root.style.setProperty('--secondary-color', branding.secondaryColor);
        root.style.setProperty('--accent-color', branding.accentColor);
        root.style.setProperty('--font-family', branding.fontFamily);
    }, [branding]);

    return <>{children}</>;
}
