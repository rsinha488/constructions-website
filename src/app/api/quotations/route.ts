import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Quotation from '@/models/Quotation';
import Tenant from '@/models/Tenant';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = session.user as any;
        if (!user.tenantId) {
            return NextResponse.json({ error: 'Tenant ID not found' }, { status: 400 });
        }

        await dbConnect();
        const data = await req.json();

        // Generate quotation number (simple auto-increment logic for MVP)
        // In production, this should be more robust
        const count = await Quotation.countDocuments({ tenantId: user.tenantId });
        const quotationNumber = `QT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const quotation = await Quotation.create({
            ...data,
            tenantId: user.tenantId,
            quotationNumber,
        });

        return NextResponse.json(quotation, { status: 201 });
    } catch (error: any) {
        console.error('Create Quotation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = session.user as any;
        await dbConnect();

        const quotations = await Quotation.find({ tenantId: user.tenantId })
            .sort({ createdAt: -1 });

        return NextResponse.json(quotations);
    } catch (error: any) {
        console.error('Fetch Quotations Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
