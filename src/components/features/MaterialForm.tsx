'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';

const materialSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(2, 'Category is required'),
    price: z.number().min(0, 'Price must be positive'),
    images: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one image is required'),
    specifications: z.array(z.object({
        key: z.string().min(1, 'Key is required'),
        value: z.string().min(1, 'Value is required')
    }))
});

type MaterialFormValues = z.infer<typeof materialSchema>;

interface MaterialFormProps {
    readonly initialData?: any;
    readonly onSuccess: () => void;
    readonly onCancel: () => void;
}

export default function MaterialForm({ initialData, onSuccess, onCancel }: MaterialFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<MaterialFormValues>({
        resolver: zodResolver(materialSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            category: '',
            price: 0,
            images: [''],
            specifications: [{ key: '', value: '' }]
        }
    });

    const images = watch('images');
    const specifications = watch('specifications');

    const onSubmit = async (data: MaterialFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const url = initialData ? `/api/materials/${initialData._id}` : '/api/materials';
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save material');

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Material Name"
                    placeholder="e.g. Premium Portland Cement"
                    {...register('name')}
                    error={errors.name?.message}
                />
                <Input
                    label="Category"
                    placeholder="e.g. Cement"
                    {...register('category')}
                    error={errors.category?.message}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Price (₹)"
                    type="number"
                    placeholder="0.00"
                    {...register('price', { valueAsNumber: true })}
                    error={errors.price?.message}
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                    id="description"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] text-slate-900"
                    placeholder="Describe the material's properties and uses..."
                    {...register('description')}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            {/* Images Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-slate-700">Image URLs</label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary gap-1"
                        onClick={() => setValue('images', [...images, ''])}
                    >
                        <Plus className="w-4 h-4" /> Add Image
                    </Button>
                </div>
                <div className="space-y-3">
                    {images.map((_, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="flex-grow">
                                <FileUploader
                                    folder="materials"
                                    currentImage={images[index]}
                                    onUploadSuccess={(url) => {
                                        const newImages = [...images];
                                        newImages[index] = url;
                                        setValue('images', newImages);
                                    }}
                                />
                                {errors.images?.[index]?.message && <p className="mt-1 text-xs text-red-500 font-medium">{errors.images[index]?.message}</p>}
                            </div>
                            {images.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-600 p-2 h-auto mt-2"
                                    onClick={() => setValue('images', images.filter((_, i) => i !== index))}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Specifications Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-slate-700">Specifications</label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary gap-1"
                        onClick={() => setValue('specifications', [...specifications, { key: '', value: '' }])}
                    >
                        <Plus className="w-4 h-4" /> Add Spec
                    </Button>
                </div>
                <div className="space-y-3">
                    {specifications.map((_, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <Input
                                placeholder="Key (e.g. Grade)"
                                {...register(`specifications.${index}.key` as const)}
                                className="w-1/3"
                            />
                            <Input
                                placeholder="Value (e.g. OPC 53)"
                                {...register(`specifications.${index}.value` as const)}
                                className="flex-grow"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-red-400 hover:text-red-600 p-2 h-auto mt-2"
                                onClick={() => setValue('specifications', specifications.filter((_, i) => i !== index))}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? 'Update Material' : 'Create Material')}
                </Button>
            </div>
        </form>
    );
}
