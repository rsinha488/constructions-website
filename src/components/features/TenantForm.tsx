'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';

const tenantSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
    branding: z.object({
        primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
        secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
        accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
        fontFamily: z.string().min(1, 'Font family is required'),
    }),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone must be at least 10 digits'),
        address: z.string().min(10, 'Address must be at least 10 characters'),
    })
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TenantForm({ initialData, onSuccess, onCancel }: TenantFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<TenantFormValues>({
        resolver: zodResolver(tenantSchema),
        defaultValues: initialData || {
            name: '',
            slug: '',
            branding: {
                primaryColor: '#0f172a',
                secondaryColor: '#64748b',
                accentColor: '#f59e0b',
                fontFamily: 'Inter',
            },
            contact: {
                email: '',
                phone: '',
                address: '',
            }
        }
    });

    const onSubmit = async (data: TenantFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const url = initialData ? `/api/tenants/${initialData._id}` : '/api/tenants';
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save tenant');

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Company Name"
                    placeholder="e.g. BuildRight Construction"
                    {...register('name')}
                    error={errors.name?.message}
                />
                <Input
                    label="Slug (URL identifier)"
                    placeholder="e.g. buildright"
                    {...register('slug')}
                    error={errors.slug?.message}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Primary Color"
                    type="color"
                    {...register('branding.primaryColor')}
                    error={errors.branding?.primaryColor?.message}
                />
                <Input
                    label="Secondary Color"
                    type="color"
                    {...register('branding.secondaryColor')}
                    error={errors.branding?.secondaryColor?.message}
                />
                <Input
                    label="Accent Color"
                    type="color"
                    {...register('branding.accentColor')}
                    error={errors.branding?.accentColor?.message}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="contact@company.com"
                        {...register('contact.email')}
                        error={errors.contact?.email?.message}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        {...register('contact.phone')}
                        error={errors.contact?.phone?.message}
                    />
                </div>
                <Input
                    label="Office Address"
                    placeholder="Full address of the company..."
                    {...register('contact.address')}
                    error={errors.contact?.address?.message}
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? 'Update Tenant' : 'Create Tenant')}
                </Button>
            </div>
        </form>
    );
}
