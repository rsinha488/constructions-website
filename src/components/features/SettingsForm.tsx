'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Loader2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';

const settingsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsForm() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
        }
    });

    const onSubmit = async (data: SettingsFormValues) => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            // Update session
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: data.name,
                    email: data.email,
                }
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="p-8 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Profile Settings</h2>
                    <p className="text-sm text-slate-500">Update your personal information and email address.</p>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                placeholder="Your Name"
                                {...register('name')}
                                error={errors.name?.message}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="your@email.com"
                                {...register('email')}
                                error={errors.email?.message}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
