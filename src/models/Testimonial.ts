import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    tenantId: mongoose.Types.ObjectId;
    userName: string;
    userRole?: string;
    content: string;
    rating: number;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        userName: { type: String, required: true },
        userRole: { type: String },
        content: { type: String, required: true },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        isFeatured: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
