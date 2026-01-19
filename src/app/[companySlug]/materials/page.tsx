import React from 'react';
import { getTenantBySlug } from '@/lib/tenant';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface MaterialsPageProps {
    params: Promise<{ companySlug: string }>;
}

export default async function MaterialsPage({ params }: MaterialsPageProps) {
    const { companySlug } = await params;
    const tenant = await getTenantBySlug(companySlug);

    if (!tenant) {
        notFound();
    }

    await dbConnect();
    const materials = await Material.find({
        tenantId: tenant._id,
        isActive: true
    }).sort({ createdAt: -1 });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Construction Materials</h1>
                <p className="text-slate-600">Browse our high-quality catalog for your next project.</p>
            </div>

            {materials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {materials.map((material) => (
                        <Card key={material._id.toString()} className="group">
                            <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                {material.images?.[0] ? (
                                    <img
                                        src={material.images[0]}
                                        alt={material.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                                    {material.category}
                                </p>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{material.name}</h3>
                                <p className="text-slate-600 text-sm line-clamp-2 mb-6">{material.description}</p>
                                <Link href={`/materials/${material._id}`}>
                                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">No materials found for this company.</p>
                </div>
            )}
        </div>
    );
}
