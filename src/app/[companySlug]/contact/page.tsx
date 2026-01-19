import React from 'react';
import { getTenantBySlug } from '@/lib/tenant';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/features/ContactForm';

interface ContactPageProps {
    params: Promise<{ companySlug: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { companySlug } = await params;
    const tenant = await getTenantBySlug(companySlug);

    if (!tenant) {
        notFound();
    }

    // Convert lean object to plain object for client component
    const plainTenant = JSON.parse(JSON.stringify(tenant));

    return <ContactForm tenant={plainTenant} />;
}
