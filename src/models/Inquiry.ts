import mongoose, { Schema, Document } from 'mongoose';
import { InquiryStatus } from '@/types';

export interface IInquiry extends Document {
    tenantId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    materialId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: InquiryStatus;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        materialId: { type: Schema.Types.ObjectId, ref: 'Material' },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(InquiryStatus),
            default: InquiryStatus.PENDING,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
