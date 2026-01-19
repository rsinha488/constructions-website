import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<any> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const tenant = await Tenant.findById(id);
        if (!tenant) return errorResponse('Tenant not found', 404);
        return successResponse(tenant);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<any> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return errorResponse('Unauthorized', 401);
        }

        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const tenant = await Tenant.findByIdAndUpdate(id, body, { new: true });
        if (!tenant) return errorResponse('Tenant not found', 404);

        return successResponse(tenant);
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
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return errorResponse('Unauthorized', 401);
        }

        await dbConnect();
        const { id } = await params;

        const tenant = await Tenant.findByIdAndDelete(id);
        if (!tenant) return errorResponse('Tenant not found', 404);

        return successResponse({ message: 'Tenant deleted successfully' });
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
