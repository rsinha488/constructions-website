import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotation extends Document {
    tenantId: mongoose.Types.ObjectId;
    quotationNumber: string;
    projectTitle: string;
    introduction: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    termsAndConditions: string;
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}

const QuotationSchema: Schema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
        quotationNumber: { type: String, required: true },
        projectTitle: { type: String, required: true },
        introduction: { type: String },
        customer: {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String },
            address: { type: String },
        },
        items: [
            {
                description: { type: String, required: true },
                quantity: { type: Number, required: true },
                unitPrice: { type: Number, required: true },
                total: { type: Number, required: true },
            },
        ],
        subtotal: { type: Number, required: true },
        tax: { type: Number, default: 0 },
        total: { type: Number, required: true },
        termsAndConditions: { type: String },
        status: {
            type: String,
            enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'],
            default: 'DRAFT'
        },
        validUntil: { type: Date },
    },
    { timestamps: true }
);

// Compound index to ensure unique quotation numbers per tenant
QuotationSchema.index({ tenantId: 1, quotationNumber: 1 }, { unique: true });

export default mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);
