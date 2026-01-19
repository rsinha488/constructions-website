import React from 'react';
import GlobalNavbar from '@/components/layout/GlobalNavbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
    {
        name: 'Basic',
        description: 'Individual owner',
        price: '₹9,999',
        period: '/ year',
        icon: Shield,
        features: [
            'Material info',
            'Contact access',
            'Company profile',
            'Feedback/testimonials',
        ],
        buttonText: 'Get Started',
        highlight: false,
    },
    {
        name: 'Standard',
        description: 'Contractor',
        price: '₹14,999',
        period: '/ year',
        icon: Zap,
        features: [
            'Lead/contact access',
            'Material pricing',
            'Dashboard',
            'Reviews & ratings',
        ],
        buttonText: 'Upgrade to Standard',
        highlight: true,
    },
    {
        name: 'Premium',
        description: 'Small Builder',
        price: '₹29,999',
        period: '/ year',
        icon: Crown,
        features: [
            'Featured listing',
            'Priority leads',
            'Analytics',
            'Admin support',
        ],
        buttonText: 'Go Premium',
        highlight: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <GlobalNavbar />

            <main className="container mx-auto px-4 py-24">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Simple, <span className="text-blue-600">Transparent</span> Pricing
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Choose the plan that best fits your business needs and start growing with Construct Platform today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingTiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative border-none shadow-xl transition-all duration-500 hover:-translate-y-2 ${tier.highlight ? 'ring-2 ring-blue-600 scale-105 z-10' : 'bg-white'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader className="p-8 pb-0">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    <tier.icon className="w-7 h-7" />
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900">{tier.name}</CardTitle>
                                <p className="text-slate-500 font-medium">{tier.description}</p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-slate-900">{tier.price}</span>
                                    <span className="text-slate-500 font-bold">{tier.period}</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-slate-600 font-medium">
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/admin">
                                    <Button
                                        className={`w-full py-6 text-lg font-bold ${tier.highlight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'
                                            }`}
                                    >
                                        {tier.buttonText}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-slate-500 font-medium">
                        Need a custom plan for a large enterprise?
                        <Link href="/contact" className="text-blue-600 font-bold ml-2 hover:underline">
                            Contact our sales team
                        </Link>
                    </p>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-200 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 Construct Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
