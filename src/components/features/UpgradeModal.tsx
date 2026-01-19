'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { X, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="relative h-32 bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap className="w-8 h-8 text-primary fill-primary" />
                    </div>
                </div>

                <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Upgrade Your Plan</h2>
                    <p className="text-slate-500 mb-8">You've reached the limit of 50 images. Upgrade now to unlock unlimited uploads and premium features.</p>

                    <div className="space-y-4 mb-8">
                        {[
                            'Unlimited Image Uploads',
                            'HD Quality Storage',
                            'Priority Support',
                            'Advanced Analytics'
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-left p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold text-slate-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="h-12 text-lg gap-2 shadow-lg shadow-primary/20">
                            Upgrade Now
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Maybe Later
                        </Button>
                    </div>

                    <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Secure payment powered by Stripe
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
