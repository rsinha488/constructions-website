import React from 'react';
import { notFound } from 'next/navigation';
import { getTenantBySlug } from '@/lib/tenant';
import ThemeProvider from '@/components/layout/ThemeProvider';
import Navbar from '@/components/layout/Navbar';

interface TenantLayoutProps {
    children: React.ReactNode;
    params: Promise<any>;
}

export default async function TenantLayout({
    children,
    params,
}: TenantLayoutProps) {
    const { companySlug } = await params;
    const tenant = await getTenantBySlug(companySlug);

    if (!tenant) {
        notFound();
    }

    return (
        <ThemeProvider branding={tenant.branding}>
            <div className="min-h-screen flex flex-col">
                <Navbar tenantName={tenant.name} slug={tenant.slug} />
                <main className="flex-grow">{children}</main>
                {/* Footer could go here */}
            </div>
        </ThemeProvider>
    );
}
