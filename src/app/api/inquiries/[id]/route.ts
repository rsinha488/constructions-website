import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<any> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return errorResponse('Unauthorized', 401);

        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return errorResponse('Inquiry not found', 404);

        // RBAC: Admin can only update their own tenant's inquiries
        if ((session.user as any).role === UserRole.ADMIN && inquiry.tenantId.toString() !== (session.user as any).tenantId) {
            return errorResponse('Forbidden', 403);
        }

        const updatedInquiry = await Inquiry.findByIdAndUpdate(id, body, { new: true });
        return successResponse(updatedInquiry);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<any> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role === UserRole.USER) {
            return errorResponse('Unauthorized', 401);
        }

        await dbConnect();
        const { id } = await params;

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) return errorResponse('Inquiry not found', 404);

        // RBAC
        if ((session.user as any).role === UserRole.ADMIN && inquiry.tenantId.toString() !== (session.user as any).tenantId) {
            return errorResponse('Forbidden', 403);
        }

        await Inquiry.findByIdAndDelete(id);
        return successResponse({ message: 'Inquiry deleted successfully' });
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
