import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Tenant from '@/models/Tenant';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle2, Download, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

async function getQuotation(id: string) {
    await dbConnect();
    try {
        const quotation = await Quotation.findById(id).populate('tenantId');
        if (!quotation) return null;
        return JSON.parse(JSON.stringify(quotation));
    } catch (error) {
        return null;
    }
}

export default async function QuotationPage({ params }: { params: { id: string } }) {
    const quotation = await getQuotation(params.id);

    if (!quotation) {
        notFound();
    }

    const tenant = quotation.tenantId;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
            {/* Header / Banner */}
            <div className="bg-slate-900 text-white pb-32">
                <div className="container mx-auto px-4 pt-12 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            {tenant.logo && (
                                <img
                                    src={tenant.logo}
                                    alt={tenant.name}
                                    className="w-16 h-16 rounded-xl bg-white p-1 object-contain"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold">{tenant.name}</h1>
                                <p className="text-slate-400 text-sm">Professional Proposal</p>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-slate-400 text-sm">Reference #</p>
                            <p className="font-mono font-bold text-lg">{quotation.quotationNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-24 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Title & Intro */}
                        <Card className="border-none shadow-xl overflow-hidden">
                            <div className="h-2 bg-primary w-full" />
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">{quotation.projectTitle}</h2>
                                        <p className="text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
                                        {quotation.status}
                                    </div>
                                </div>

                                {quotation.introduction && (
                                    <div className="prose prose-slate max-w-none text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <p>{quotation.introduction}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Line Items */}
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-0 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                                            <th className="p-6 font-bold">Description</th>
                                            <th className="p-6 font-bold text-center">Qty</th>
                                            <th className="p-6 font-bold text-right">Unit Price</th>
                                            <th className="p-6 font-bold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {quotation.items.map((item: any, index: number) => (
                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-6 font-medium text-slate-800">{item.description}</td>
                                                <td className="p-6 text-center text-slate-600">{item.quantity}</td>
                                                <td className="p-6 text-right text-slate-600">₹{item.unitPrice.toLocaleString()}</td>
                                                <td className="p-6 text-right font-bold text-slate-900">₹{item.total.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50 border-t border-slate-200">
                                        <tr>
                                            <td colSpan={3} className="p-4 text-right text-slate-500 font-medium">Subtotal</td>
                                            <td className="p-4 text-right font-bold text-slate-800">₹{quotation.subtotal.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="p-4 text-right text-slate-500 font-medium">Tax</td>
                                            <td className="p-4 text-right font-bold text-slate-800">₹{quotation.tax.toLocaleString()}</td>
                                        </tr>
                                        <tr className="bg-slate-900 text-white">
                                            <td colSpan={3} className="p-6 text-right font-bold text-lg">Total Amount</td>
                                            <td className="p-6 text-right font-black text-2xl">₹{quotation.total.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </CardContent>
                        </Card>

                        {/* Terms */}
                        {quotation.termsAndConditions && (
                            <div className="mt-8">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-400" /> Terms & Conditions
                                </h3>
                                <div className="text-sm text-slate-500 whitespace-pre-line pl-4 border-l-4 border-slate-200">
                                    {quotation.termsAndConditions}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <Card className="border-none shadow-lg bg-white sticky top-6">
                            <CardContent className="p-6 space-y-4">
                                <Button className="w-full h-12 text-lg gap-2 shadow-lg shadow-primary/20">
                                    <CheckCircle2 className="w-5 h-5" /> Accept Proposal
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Download className="w-4 h-4 mr-2" /> Download PDF
                                </Button>
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    By clicking accept, you agree to the terms and conditions listed in this proposal.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Client Info */}
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Prepared For</h3>
                                <div className="space-y-3">
                                    <div className="font-bold text-lg text-slate-800">{quotation.customer.name}</div>
                                    {quotation.customer.email && (
                                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                                            <Mail className="w-4 h-4" /> {quotation.customer.email}
                                        </div>
                                    )}
                                    {quotation.customer.phone && (
                                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                                            <Phone className="w-4 h-4" /> {quotation.customer.phone}
                                        </div>
                                    )}
                                    {quotation.customer.address && (
                                        <div className="flex items-start gap-3 text-slate-500 text-sm">
                                            <MapPin className="w-4 h-4 mt-1 shrink-0" /> {quotation.customer.address}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Provider Info */}
                        <Card className="border-none shadow-lg bg-slate-900 text-slate-300">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Service Provider</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="font-bold text-white text-lg">{tenant.name}</div>
                                    {tenant.contact?.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4" /> {tenant.contact.email}
                                        </div>
                                    )}
                                    {tenant.contact?.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4" /> {tenant.contact.phone}
                                        </div>
                                    )}
                                    {tenant.contact?.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 mt-1 shrink-0" /> {tenant.contact.address}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
