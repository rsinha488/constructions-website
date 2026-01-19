import React from 'react';
import { getTenantBySlug } from '@/lib/tenant';
import { notFound } from 'next/navigation';
import WhiteLabelHome from '@/components/features/WhiteLabelHome';
import GlobalNavbar from '@/components/layout/GlobalNavbar';

interface TenantHomePageProps {
    params: Promise<any>;
}

export default async function TenantHomePage({ params }: TenantHomePageProps) {
    const { companySlug } = await params;
    const tenant = await getTenantBySlug(companySlug);

    if (!tenant) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <GlobalNavbar />
            <WhiteLabelHome tenant={tenant} />
            <footer className="py-12 border-t border-slate-100 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 {tenant.name}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
