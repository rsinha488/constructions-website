import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    name: string;
    description: string;
    category: string;
    price?: number;
    images: string[];
    specifications: { key: string; value: string }[];
    tenantId: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MaterialSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true, index: true },
        price: { type: Number },
        images: [{ type: String }],
        specifications: [
            {
                key: { type: String },
                value: { type: String },
            },
        ],
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

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
