'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, ShieldAlert, ExternalLink, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import TenantForm from './TenantForm';
import { useRouter } from 'next/navigation';

interface TenantManagementProps {
    initialTenants: any[];
}

export default function TenantManagement({ initialTenants }: TenantManagementProps) {
    const [tenants, setTenants] = useState(initialTenants);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleAdd = () => {
        setEditingTenant(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tenant: any) => {
        setEditingTenant(tenant);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tenant? This will remove all associated data.')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            setTenants(tenants.filter(t => t._id !== id));
            router.refresh();
        } catch (err) {
            alert('Error deleting tenant');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh();
        window.location.reload();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Tenant Management</h1>
                    <p className="text-slate-500">Create and manage construction company accounts on the platform.</p>
                </div>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> New Tenant
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Company</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Branding</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tenants.map((tenant: any) => (
                                    <tr key={tenant._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{tenant.name}</p>
                                            <p className="text-xs text-slate-500">{tenant.contact.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{tenant.slug}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: tenant.branding.primaryColor }} title="Primary" />
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: tenant.branding.secondaryColor }} title="Secondary" />
                                                <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: tenant.branding.accentColor }} title="Accent" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tenant.settings.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                {tenant.settings.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/${tenant.slug}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-400 hover:text-blue-600">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-amber-600"
                                                    onClick={() => handleEdit(tenant)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-red-600"
                                                    onClick={() => handleDelete(tenant._id)}
                                                    disabled={deletingId === tenant._id}
                                                >
                                                    {deletingId === tenant._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-black text-slate-900">
                                {editingTenant ? 'Edit Tenant' : 'Create New Tenant'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-8">
                            <TenantForm
                                initialData={editingTenant}
                                onSuccess={handleSuccess}
                                onCancel={() => setIsModalOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
