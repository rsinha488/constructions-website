import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    authorId: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, index: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        coverImage: { type: String },
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure slug is unique per tenant
BlogSchema.index({ slug: 1, tenantId: 1 }, { unique: true });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
