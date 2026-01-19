import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import User from '@/models/User';
import Material from '@/models/Material';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';

export default async function SuperAdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (user.role !== UserRole.SUPER_ADMIN) {
        redirect('/admin');
    }

    await dbConnect();

    const stats = {
        totalTenants: await Tenant.countDocuments(),
        totalUsers: await User.countDocuments(),
        totalMaterials: await Material.countDocuments(),
    };

    const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Platform Management</h1>
                <p className="text-slate-500">Overview of all tenants and users across the platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tenants</p>
                        <p className="text-4xl font-black text-slate-900">{stats.totalTenants}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Materials</p>
                        <p className="text-4xl font-black text-slate-900">{stats.totalMaterials}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tenants */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Recently Joined Tenants</h2>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Tenant Name</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact Email</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentTenants.map((tenant: any) => (
                                    <tr key={tenant._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{tenant.name}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{tenant.slug}</td>
                                        <td className="px-6 py-4 text-slate-600">{tenant.contact.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tenant.settings.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                {tenant.settings.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
