'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, FileText, ExternalLink, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

interface Quotation {
    _id: string;
    quotationNumber: string;
    projectTitle: string;
    customer: {
        name: string;
    };
    total: number;
    status: string;
    createdAt: string;
}

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            const response = await fetch('/api/quotations');
            if (response.ok) {
                const data = await response.json();
                setQuotations(data);
            }
        } catch (error) {
            console.error('Failed to fetch quotations', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuotations = quotations.filter(q =>
        q.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Quotations</h1>
                    <p className="text-slate-500">Manage your digital proposals and track their status.</p>
                </div>
                <Link href="/admin/quotations/create">
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" /> Create New Proposal
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <Search className="w-5 h-5 text-slate-400" />
                <Input
                    placeholder="Search by project, client, or number..."
                    className="border-none shadow-none focus-visible:ring-0 p-0 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading quotations...</div>
            ) : filteredQuotations.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No quotations found</h3>
                    <p className="text-slate-500 mb-6">Create your first digital proposal to get started.</p>
                    <Link href="/admin/quotations/create">
                        <Button variant="outline">Create Proposal</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredQuotations.map((quotation) => (
                        <Card key={quotation._id} className="hover:shadow-md transition-shadow border-slate-100">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 flex-grow">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{quotation.projectTitle}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="font-mono font-medium text-slate-400">{quotation.quotationNumber}</span>
                                            <span>•</span>
                                            <span>{quotation.customer.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Amount</p>
                                        <p className="font-black text-lg text-slate-900">₹{quotation.total.toLocaleString()}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${quotation.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                                                quotation.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-800'}`}>
                                            {quotation.status.toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/quotations/${quotation._id}`} target="_blank">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <ExternalLink className="w-4 h-4" /> View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
