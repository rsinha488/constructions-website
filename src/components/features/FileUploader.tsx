'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import UpgradeModal from './UpgradeModal';

interface FileUploaderProps {
    readonly onUploadSuccess: (url: string) => void;
    readonly folder?: string;
    readonly label?: string;
    readonly currentImage?: string;
}

export default function FileUploader({ onUploadSuccess, folder = 'general', label, currentImage }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = async (url: string) => {
        if (!url) return;

        try {
            // Extract public ID from URL
            // This is a simplified extraction, might need adjustment based on actual URL format
            // Assuming helper function or simple split
            const parts = url.split('/');
            // const filename = parts.at(-1);
            // const publicId = `construction/${folder}/${filename?.split('.')[0]}`; 

            // Better to use the helper if available on client side, but it might be server-only?
            // Let's assume we pass the publicId or extract it. 
            // Actually, for security, maybe we should just pass the URL to the API and let it handle extraction?
            // But the API expects publicId. 
            // Let's try to extract it similarly to the server.
            // Or better, let's just call the delete API with the publicId derived from URL.

            // For now, let's try to fetch with the publicId. 
            // Since we can't easily import the server helper here, let's do a best effort extraction or 
            // rely on the fact that we might have the publicId stored? No we don't.

            // Let's use a regex to extract.
            const regex = /\/v\d+\/(.+)\./;
            const match = regex.exec(url);
            if (match?.[1]) {
                await fetch(`/api/upload?publicId=${match[1]}`, {
                    method: 'DELETE',
                });
            }
        } catch (err) {
            console.error('Failed to delete image', err);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64data = reader.result as string;

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file: base64data, folder }),
                });

                const result = await response.json();

                if (!response.ok) {
                    if (result.error === 'LIMIT_REACHED') {
                        setIsUpgradeModalOpen(true);
                    } else {
                        throw new Error(result.error || 'Upload failed');
                    }
                    return;
                }

                // If there was a previous image, delete it
                if (preview && preview !== currentImage) {
                    await handleDelete(preview);
                }
                // Note: We don't automatically delete 'currentImage' (the one passed as prop) 
                // because the user might cancel the form save. 
                // But for the "professional app" requirement, if they replace it here, 
                // we usually wait for the form submit to delete the old one, OR we delete it immediately.
                // The user said "once delete or updates then remove it".
                // If we delete immediately, and they cancel, they lose the image.
                // A better approach is to delete the old image ONLY when they explicitly click "Remove" 
                // or when the form is successfully saved (which is outside this component).
                // However, to keep it simple and strictly follow "updates then remove", 
                // we can delete the *previous upload in this session* (handled above).

                setPreview(result.url);
                onUploadSuccess(result.url);
            };
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-bold text-slate-700">{label}</label>}

            <div className="relative group">
                {preview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="bg-white hover:bg-slate-100 border-none"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="bg-white hover:bg-red-50 text-red-500 border-none"
                                onClick={async () => {
                                    if (preview) {
                                        // Only delete if it's a newly uploaded image in this session
                                        // OR if the user explicitly wants to remove the current image
                                        // For now, let's delete if it's not the initial one, 
                                        // or if we want to support deleting the initial one too.
                                        // Let's support deleting the current one too for "Remove".
                                        await handleDelete(preview);
                                    }
                                    setPreview(null);
                                    onUploadSuccess('');
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary"
                    >
                        {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">Click to upload image</p>
                                    <p className="text-xs">PNG, JPG up to 5MB</p>
                                </div>
                            </>
                        )}
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                </p>
            )}

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    );
}
