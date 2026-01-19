import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import { redirect } from 'next/navigation';
import CompanySettingsForm from '@/components/features/CompanySettingsForm';

export default async function CompanySettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (!user.tenantId) {
        redirect('/dashboard');
    }

    await dbConnect();
    const tenant = await Tenant.findById(user.tenantId);

    if (!tenant) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Company Settings</h1>
                <p className="text-slate-500">Manage your company's public profile, contact info, and leadership team.</p>
            </div>

            <CompanySettingsForm tenant={structuredClone(tenant.toObject())} />
        </div>
    );
}
