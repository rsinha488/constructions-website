'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, Trash2, Save, Loader2, FileText, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const quotationSchema = z.object({
    projectTitle: z.string().min(2, { message: 'Project title is required' }),
    introduction: z.string().optional(),
    customer: z.object({
        name: z.string().min(2, { message: 'Customer name is required' }),
        email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
    items: z.array(z.object({
        description: z.string().min(1, { message: 'Description is required' }),
        quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
        unitPrice: z.number().min(0, { message: 'Price must be non-negative' }),
        total: z.number(),
    })).min(1, { message: 'At least one item is required' }),
    termsAndConditions: z.string().optional(),
    validUntil: z.string().optional(), // Date string from input
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

export default function QuotationBuilder() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
            introduction: "We are pleased to submit this proposal for your review. We look forward to the opportunity to work with you.",
            termsAndConditions: "1. This quotation is valid for 30 days.\n2. 50% advance payment required to start work.\n3. Final payment due upon completion.",
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const items = watch('items');

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.18; // Assuming 18% GST/Tax for now, can be made configurable
    const total = subtotal + tax;

    const onSubmit = async (data: QuotationFormValues) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                subtotal,
                tax,
                total,
                validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
            };

            const response = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create quotation');

            const result = await response.json();
            router.push(`/admin/quotations`); // Redirect to list
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save quotation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Create Proposal</h1>
                    <p className="text-slate-500">Draft a professional digital quotation for your client.</p>
                </div>
                <Button type="submit" disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Proposal
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Project & Client Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <FileText className="w-5 h-5 text-primary" /> Project Details
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Input
                                label="Project Title"
                                placeholder="e.g., Luxury Villa Construction - Phase 1"
                                {...register('projectTitle')}
                                error={errors.projectTitle?.message}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Introduction / Cover Note</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-slate-900"
                                    placeholder="Write a persuasive introduction..."
                                    {...register('introduction')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <FileText className="w-5 h-5 text-primary" /> Line Items
                            </h3>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary/30 transition-colors">
                                    <div className="flex-grow space-y-3">
                                        <Input
                                            placeholder="Item Description"
                                            {...register(`items.${index}.description`)}
                                            error={errors.items?.[index]?.description?.message}
                                        />
                                        <div className="flex gap-4">
                                            <div className="w-24">
                                                <Input
                                                    type="number"
                                                    placeholder="Qty"
                                                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                                    error={errors.items?.[index]?.quantity?.message}
                                                />
                                            </div>
                                            <div className="w-32">
                                                <Input
                                                    type="number"
                                                    placeholder="Price"
                                                    {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                                    error={errors.items?.[index]?.unitPrice?.message}
                                                />
                                            </div>
                                            <div className="flex-grow flex items-center justify-end font-bold text-slate-700">
                                                ₹{(items[index]?.quantity * items[index]?.unitPrice || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ description: '', quantity: 1, unitPrice: 0, total: 0 })}
                                className="w-full border-dashed border-2 hover:border-primary hover:text-primary"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Client & Summary */}
                <div className="space-y-6">
                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-slate-800">Client Information</h3>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Input
                                label="Client Name"
                                placeholder="John Doe"
                                {...register('customer.name')}
                                error={errors.customer?.name?.message}
                            />
                            <Input
                                label="Email"
                                placeholder="john@example.com"
                                {...register('customer.email')}
                                error={errors.customer?.email?.message}
                            />
                            <Input
                                label="Phone"
                                placeholder="+91 98765 43210"
                                {...register('customer.phone')}
                                error={errors.customer?.phone?.message}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Address</label>
                                <textarea
                                    className="w-full min-h-[80px] p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-slate-900"
                                    {...register('customer.address')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-slate-900 text-white">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-lg border-b border-slate-700 pb-4 mb-4">Summary</h3>
                            <div className="flex justify-between text-slate-300">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Tax (18%)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-700 flex justify-between text-xl font-black text-white">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-slate-800">Terms & Validity</h3>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Input
                                type="date"
                                label="Valid Until"
                                {...register('validUntil')}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Terms & Conditions</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-slate-900 text-sm"
                                    {...register('termsAndConditions')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
