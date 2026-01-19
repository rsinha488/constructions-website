'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { InquiryStatus } from '@/types';
import { format } from 'date-fns';

interface UserInquiryListProps {
    inquiries: any[];
}

export default function UserInquiryList({ inquiries }: UserInquiryListProps) {
    const getStatusColor = (status: InquiryStatus) => {
        switch (status) {
            case InquiryStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
            case InquiryStatus.RESPONDED: return 'bg-blue-100 text-blue-700 border-blue-200';
            case InquiryStatus.CLOSED: return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">My Inquiries</h1>
                <p className="text-slate-500">Track the status of your material and service requests.</p>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Material / Service</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Company</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Message</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inquiries.length > 0 ? inquiries.map((inquiry: any) => (
                                    <tr key={inquiry._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {inquiry.materialId?.images?.[0] ? (
                                                    <img src={inquiry.materialId.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">N/A</div>
                                                )}
                                                <span className="font-bold text-slate-900">{inquiry.materialId?.name || 'General Inquiry'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{inquiry.tenantId?.name}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{inquiry.message}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                            You haven't made any inquiries yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
