'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Mail, Loader2, Eye, Trash2, X, Phone, Calendar, User, Package } from 'lucide-react';
import { InquiryStatus } from '@/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface InquiryManagementProps {
    readonly initialInquiries: any[];
}

export default function InquiryManagement({ initialInquiries }: InquiryManagementProps) {
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const router = useRouter();

    const handleStatusUpdate = async (id: string, status: InquiryStatus) => {
        setUpdatingId(id);
        try {
            const response = await fetch(`/api/inquiries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Failed to update');

            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status } : inq));
            if (selectedInquiry?._id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
            router.refresh();
        } catch (err) {
            alert('Error updating status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            setInquiries(inquiries.filter(inq => inq._id !== id));
            if (selectedInquiry?._id === id) setSelectedInquiry(null);
            router.refresh();
        } catch (err) {
            alert('Error deleting inquiry');
        } finally {
            setDeletingId(null);
        }
    };

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
                <h1 className="text-3xl font-black text-slate-900">Customer Inquiries</h1>
                <p className="text-slate-500">Track and respond to customer requests for materials and services.</p>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Material</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Message</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inquiries.length > 0 ? inquiries.map((inquiry: any) => (
                                    <tr key={inquiry._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{inquiry.name}</p>
                                            <p className="text-xs text-slate-500">{inquiry.email}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{format(new Date(inquiry.createdAt), 'MMM dd, HH:mm')}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {inquiry.materialId?.name || 'General Inquiry'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{inquiry.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-primary"
                                                    title="View Details"
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-blue-600"
                                                    title="Reply"
                                                    onClick={() => globalThis.location.href = `mailto:${inquiry.email}`}
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-red-600"
                                                    title="Delete"
                                                    onClick={() => handleDelete(inquiry._id)}
                                                    disabled={deletingId === inquiry._id}
                                                >
                                                    {deletingId === inquiry._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                            No inquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Inquiry Details</h2>
                                <p className="text-slate-500 text-sm">Submitted on {format(new Date(selectedInquiry.createdAt), 'MMMM dd, yyyy at HH:mm')}</p>
                            </div>
                            <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-grow space-y-8">
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3" /> Customer Name
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">{selectedInquiry.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">{selectedInquiry.email}</p>
                                </div>
                                {selectedInquiry.phone && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="w-3 h-3" /> Phone Number
                                        </p>
                                        <p className="text-lg font-bold text-slate-900">{selectedInquiry.phone}</p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Package className="w-3 h-3" /> Interested In
                                    </p>
                                    <p className="text-lg font-bold text-primary">{selectedInquiry.materialId?.name || 'General Inquiry'}</p>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Message</p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="space-y-4">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Update Status</p>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant={selectedInquiry.status === InquiryStatus.PENDING ? 'primary' : 'outline'}
                                        className="gap-2"
                                        onClick={() => handleStatusUpdate(selectedInquiry._id, InquiryStatus.PENDING)}
                                        disabled={updatingId === selectedInquiry._id}
                                    >
                                        <Calendar className="w-4 h-4" /> Pending
                                    </Button>
                                    <Button
                                        variant={selectedInquiry.status === InquiryStatus.RESPONDED ? 'primary' : 'outline'}
                                        className="gap-2"
                                        onClick={() => handleStatusUpdate(selectedInquiry._id, InquiryStatus.RESPONDED)}
                                        disabled={updatingId === selectedInquiry._id}
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Responded
                                    </Button>
                                    <Button
                                        variant={selectedInquiry.status === InquiryStatus.CLOSED ? 'primary' : 'outline'}
                                        className="gap-2"
                                        onClick={() => handleStatusUpdate(selectedInquiry._id, InquiryStatus.CLOSED)}
                                        disabled={updatingId === selectedInquiry._id}
                                    >
                                        <XCircle className="w-4 h-4" /> Closed
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600 gap-2"
                                onClick={() => handleDelete(selectedInquiry._id)}
                                disabled={deletingId === selectedInquiry._id}
                            >
                                <Trash2 className="w-4 h-4" /> Delete Inquiry
                            </Button>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close</Button>
                                <Button className="gap-2" onClick={() => globalThis.location.href = `mailto:${selectedInquiry.email}`}>
                                    <Mail className="w-4 h-4" /> Reply via Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
