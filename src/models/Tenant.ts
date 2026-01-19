import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
    name: string;
    slug: string;
    logo?: string;
    branding: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        fontFamily: string;
    };
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    settings: {
        isActive: boolean;
        features: string[];
        imageCount: number;
    };
    directors: {
        name: string;
        role?: string;
        image?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TenantSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        logo: { type: String },
        branding: {
            primaryColor: { type: String, default: '#0f172a' },
            secondaryColor: { type: String, default: '#64748b' },
            accentColor: { type: String, default: '#f59e0b' },
            fontFamily: { type: String, default: 'Inter' },
        },
        contact: {
            email: { type: String, required: true },
            phone: { type: String },
            address: { type: String },
        },
        settings: {
            isActive: { type: Boolean, default: true },
            features: [{ type: String }],
            imageCount: { type: Number, default: 0 },
        },
        directors: [
            {
                name: { type: String, required: true },
                role: { type: String },
                image: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
