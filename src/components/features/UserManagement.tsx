'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2, Shield, User as UserIcon, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

interface UserManagementProps {
    initialUsers: any[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
    const [users, setUsers] = useState(initialUsers);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleRoleUpdate = async (id: string, newRole: UserRole) => {
        setUpdatingId(id);
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error('Failed to update role');

            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            router.refresh();
        } catch (err) {
            alert('Error updating role');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete user');

            setUsers(users.filter(u => u._id !== id));
            router.refresh();
        } catch (err) {
            alert('Error deleting user');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">User Management</h1>
                <p className="text-slate-500">Manage user roles and platform access.</p>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Tenant</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user: any) => (
                                    <tr key={user._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                    <UserIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user._id, e.target.value as UserRole)}
                                                disabled={updatingId === user._id}
                                            >
                                                <option value={UserRole.USER}>User</option>
                                                <option value={UserRole.ADMIN}>Admin</option>
                                                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {user.tenantId?.name || <span className="italic text-slate-400">Platform Wide</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-2 h-auto text-slate-400 hover:text-red-600"
                                                onClick={() => handleDelete(user._id)}
                                                disabled={deletingId === user._id}
                                            >
                                                {deletingId === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
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
