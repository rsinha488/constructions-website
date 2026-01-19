import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import Material from '@/models/Material';
import Tenant from '@/models/Tenant';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from 'lucide-react'; // I'll use a custom badge style
import { InquiryStatus } from '@/types';
import { format } from 'date-fns';

export default async function UserDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();

    const inquiries = await Inquiry.find({ userId: (session.user as any).id })
        .populate('materialId', 'name images')
        .populate('tenantId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    const stats = {
        total: await Inquiry.countDocuments({ userId: (session.user as any).id }),
        pending: await Inquiry.countDocuments({ userId: (session.user as any).id, status: InquiryStatus.PENDING }),
        responded: await Inquiry.countDocuments({ userId: (session.user as any).id, status: InquiryStatus.RESPONDED }),
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
                <h1 className="text-3xl font-black text-slate-900">Welcome back, {session.user?.name}!</h1>
                <p className="text-slate-500">Here's what's happening with your construction inquiries.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Inquiries</p>
                        <p className="text-4xl font-black text-slate-900">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Response</p>
                        <p className="text-4xl font-black text-amber-600">{stats.pending}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Responded</p>
                        <p className="text-4xl font-black text-blue-600">{stats.responded}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Inquiries */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Recent Inquiries</h2>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Material / Service</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Company</th>
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
                                            No inquiries found.
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
