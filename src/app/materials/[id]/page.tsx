'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import GlobalNavbar from '@/components/layout/GlobalNavbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Building2, ShieldCheck, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MaterialDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [material, setMaterial] = React.useState<any>(null);
    const [tenant, setTenant] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/materials/${id}`);
                if (!res.ok) throw new Error('Material not found');
                const data = await res.json();
                setMaterial(data);

                const tenantRes = await fetch(`/api/tenants/${data.tenantId}`);
                if (tenantRes.ok) {
                    const tenantData = await tenantRes.json();
                    setTenant(tenantData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!material) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50/30">
            <GlobalNavbar />

            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/#materials" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-12 font-bold transition-all group">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Catalog
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 group">
                            {material.images?.[0] ? (
                                <img
                                    src={material.images[0]}
                                    alt={material.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {material.images?.slice(1).map((img: string, i: number) => (
                                <motion.div
                                    key={img}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (i + 1) }}
                                    className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 cursor-pointer hover:ring-2 ring-blue-600 transition-all"
                                >
                                    <img src={img} alt={material.name} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full">
                                    {material.category}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" />
                                    Verified Quality
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {material.name}
                            </h1>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-black text-slate-900">₹{material.price.toLocaleString()}</span>
                                <span className="text-slate-400 font-bold">/ unit</span>
                            </div>
                            <p className="text-xl text-slate-500 leading-relaxed font-medium">
                                {material.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Delivery</p>
                                    <p className="text-sm font-bold text-slate-900">Pan India Shipping</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Lead Time</p>
                                    <p className="text-sm font-bold text-slate-900">2-4 Business Days</p>
                                </div>
                            </div>
                        </div>

                        <Card className="mb-12 border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
                            <CardContent className="p-10">
                                <h3 className="text-2xl font-black text-slate-900 mb-8">Technical Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                    {material.specifications?.map((spec: any) => (
                                        <div key={spec.key} className="flex flex-col gap-1 border-l-2 border-blue-600 pl-4">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{spec.key}</span>
                                            <span className="text-lg font-bold text-slate-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {tenant && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/30 transition-all duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                            <Building2 className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Authorized Supplier</p>
                                            <Link href={`/${tenant.slug}`} className="text-3xl font-black hover:text-blue-400 transition-colors">
                                                {tenant.name}
                                            </Link>
                                        </div>
                                    </div>
                                    <Link href={`/${tenant.slug}/contact?materialId=${material._id}`}>
                                        <Button className="w-full py-8 text-xl font-black bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 rounded-2xl">
                                            Request Instant Quote
                                        </Button>
                                    </Link>
                                    <p className="text-center mt-6 text-slate-400 text-sm font-medium">
                                        Typically responds within 2 hours
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
