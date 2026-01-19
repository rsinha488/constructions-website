import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
    title: string;
    slug: string;
    content: string;
    tenantId: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, index: true },
        content: { type: String, required: true },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Ensure slug is unique per tenant
PageSchema.index({ slug: 1, tenantId: 1 }, { unique: true });

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
