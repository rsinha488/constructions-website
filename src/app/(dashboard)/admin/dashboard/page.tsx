import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import Material from '@/models/Material';
import Tenant from '@/models/Tenant';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { InquiryStatus, UserRole } from '@/types';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        redirect('/dashboard');
    }

    await dbConnect();

    // If Super Admin, they might need a different view or we show stats for all if no tenantId
    const query: any = {};
    if (user.role === UserRole.ADMIN) {
        query.tenantId = user.tenantId;
    }

    const inquiries = await Inquiry.find(query)
        .populate('materialId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    const stats = {
        totalMaterials: await Material.countDocuments(query),
        pendingInquiries: await Inquiry.countDocuments({ ...query, status: InquiryStatus.PENDING }),
        totalInquiries: await Inquiry.countDocuments(query),
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
                <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500">Manage your company's materials and respond to customer inquiries.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Materials</p>
                        <p className="text-4xl font-black text-slate-900">{stats.totalMaterials}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Inquiries</p>
                        <p className="text-4xl font-black text-amber-600">{stats.pendingInquiries}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Inquiries</p>
                        <p className="text-4xl font-black text-blue-600">{stats.totalInquiries}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Inquiries */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Recent Customer Inquiries</h2>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Material</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inquiries.length > 0 ? inquiries.map((inquiry: any) => (
                                    <tr key={inquiry._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{inquiry.name}</p>
                                            <p className="text-xs text-slate-500">{inquiry.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {inquiry.materialId?.name || 'General Inquiry'}
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
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                            No inquiries yet.
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
