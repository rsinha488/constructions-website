import React from 'react';
import SettingsForm from '@/components/features/SettingsForm';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and account preferences.</p>
            </div>

            <SettingsForm />
        </div>
    );
}
