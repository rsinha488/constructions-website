'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Eye, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import MaterialForm from './MaterialForm';
import { useRouter } from 'next/navigation';

interface MaterialManagementProps {
    initialMaterials: any[];
}

export default function MaterialManagement({ initialMaterials }: MaterialManagementProps) {
    const [materials, setMaterials] = useState(initialMaterials);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleAdd = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleEdit = (material: any) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this material?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            setMaterials(materials.filter(m => m._id !== id));
            router.refresh();
        } catch (err) {
            alert('Error deleting material');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        router.refresh();
        // In a real app, we'd refetch or the server component would re-render
        // For now, we'll just reload the page to get fresh data
        window.location.reload();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Materials Management</h1>
                    <p className="text-slate-500">Add, edit, or remove materials from your catalog.</p>
                </div>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add New Material
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Material</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {materials.map((material: any) => (
                                    <tr key={material._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                                                    {material.images?.[0] && (
                                                        <img src={material.images[0]} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-900">{material.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">
                                                {material.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">₹{material.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${material.isActive
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                {material.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/materials/${material._id}`}>
                                                    <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-400 hover:text-blue-600">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-amber-600"
                                                    onClick={() => handleEdit(material)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-auto text-slate-400 hover:text-red-600"
                                                    onClick={() => handleDelete(material._id)}
                                                    disabled={deletingId === material._id}
                                                >
                                                    {deletingId === material._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                                {editingMaterial ? 'Edit Material' : 'Add New Material'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="p-8">
                            <MaterialForm
                                initialData={editingMaterial}
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
