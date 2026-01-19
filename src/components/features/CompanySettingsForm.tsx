'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Loader2, Save, Plus, Trash2, Building2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FileUploader from './FileUploader';

const companySchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    logo: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
    contact: z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
        address: z.string().min(5, { message: 'Address is required' }),
    }),
    directors: z.array(z.object({
        name: z.string().min(2, { message: 'Director name is required' }),
        role: z.string().optional(),
        image: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
    })),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanySettingsFormProps {
    readonly tenant: any;
}

export default function CompanySettingsForm({ tenant }: CompanySettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: tenant.name || '',
            logo: tenant.logo || '',
            contact: {
                email: tenant.contact?.email || '',
                phone: tenant.contact?.phone || '',
                address: tenant.contact?.address || '',
            },
            directors: tenant.directors?.length > 0 ? tenant.directors : [{ name: '', role: '', image: '' }],
        }
    });

    const directors = watch('directors');

    const onSubmit = async (data: CompanyFormValues) => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/tenants/${tenant._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update company details');

            setMessage({ type: 'success', text: 'Company details updated successfully!' });
            router.refresh();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Error updating company details' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Info */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Company Profile</h2>
                                <p className="text-sm text-slate-500">Basic identification and branding.</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <Input
                            label="Company Name"
                            placeholder="e.g. Acme Construction"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                        <div>
                            <FileUploader
                                label="Company Logo"
                                folder="logos"
                                currentImage={watch('logo')}
                                onUploadSuccess={(url) => setValue('logo', url)}
                            />
                            {errors.logo?.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.logo.message}</p>}
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-700">Contact Details</p>
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
                            <div>
                                <label htmlFor="office-address" className="block text-sm font-bold text-slate-700 mb-2">Office Address</label>
                                <textarea
                                    id="office-address"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] text-slate-900"
                                    placeholder="Full office address..."
                                    {...register('contact.address')}
                                />
                                {errors.contact?.address?.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.contact.address.message}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Directors Info */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Company Directors</h2>
                                    <p className="text-sm text-slate-500">Manage leadership team.</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary gap-1"
                                onClick={() => setValue('directors', [...directors, { name: '', role: '', image: '' }])}
                            >
                                <Plus className="w-4 h-4" /> Add Director
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {directors.map((director, index) => (
                            <div key={`${director.name}-${index}`} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative">
                                {directors.length > 1 && (
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                        onClick={() => setValue('directors', directors.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        placeholder="Director Name"
                                        {...register(`directors.${index}.name` as const)}
                                        error={errors.directors?.[index]?.name?.message}
                                    />
                                    <Input
                                        label="Role / Designation"
                                        placeholder="e.g. Managing Director"
                                        {...register(`directors.${index}.role` as const)}
                                        error={errors.directors?.[index]?.role?.message}
                                    />
                                </div>
                                <div>
                                    <FileUploader
                                        label="Director Profile Image"
                                        folder="directors"
                                        currentImage={watch(`directors.${index}.image`)}
                                        onUploadSuccess={(url) => setValue(`directors.${index}.image`, url)}
                                    />
                                    {errors.directors?.[index]?.image?.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.directors[index].image.message}</p>}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="gap-2 min-w-[200px] h-12 text-lg">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Company Details
                </Button>
            </div>
        </form>
    );
}
