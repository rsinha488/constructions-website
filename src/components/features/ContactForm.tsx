'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactPageProps {
    readonly tenant: {
        readonly name: string;
        readonly _id: any;
        readonly contact: {
            readonly email: string;
            readonly phone: string;
            readonly address: string;
        };
    };
    readonly hideInfo?: boolean;
}

export default function ContactForm({ tenant, hideInfo = false }: ContactPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    tenantId: tenant._id,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                reset();
            }
        } catch (error) {
            console.error('Error submitting inquiry:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hideInfo) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                {isSuccess ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                        <p className="text-slate-600 mb-8">We'll get back to you as soon as possible.</p>
                        <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Full Name"
                            {...register('name')}
                            error={errors.name?.message}
                            placeholder="John Doe"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Email Address"
                                {...register('email')}
                                error={errors.email?.message}
                                placeholder="john@example.com"
                            />
                            <Input
                                label="Phone Number (Optional)"
                                {...register('phone')}
                                error={errors.phone?.message}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div>
                            <label htmlFor="message-standalone" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Your Message
                            </label>
                            <textarea
                                id="message-standalone"
                                {...register('message')}
                                rows={5}
                                className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.message ? 'border-red-500 focus:ring-red-500' : ''
                                    }`}
                                placeholder="Tell us about your project..."
                            />
                            {errors.message && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full gap-2" isLoading={isSubmitting}>
                            <Send className="w-4 h-4" />
                            Send Inquiry
                        </Button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h1>
                    <p className="text-lg text-slate-600 mb-12">
                        Have a project in mind? Contact us for a free quotation or any inquiries about our materials and services.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Phone</p>
                                <p className="text-slate-600">{tenant.contact.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Email</p>
                                <p className="text-slate-600">{tenant.contact.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Address</p>
                                <p className="text-slate-600">{tenant.contact.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <Card>
                    <CardContent className="p-8">
                        {isSuccess ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                                <p className="text-slate-600 mb-8">We'll get back to you as soon as possible.</p>
                                <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Input
                                    label="Full Name"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    placeholder="John Doe"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Email Address"
                                        {...register('email')}
                                        error={errors.email?.message}
                                        placeholder="john@example.com"
                                    />
                                    <Input
                                        label="Phone Number (Optional)"
                                        {...register('phone')}
                                        error={errors.phone?.message}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message-full" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message-full"
                                        {...register('message')}
                                        rows={5}
                                        className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.message ? 'border-red-500 focus:ring-red-500' : ''
                                            }`}
                                        placeholder="Tell us about your project..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full gap-2" isLoading={isSubmitting}>
                                    <Send className="w-4 h-4" />
                                    Send Inquiry
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
