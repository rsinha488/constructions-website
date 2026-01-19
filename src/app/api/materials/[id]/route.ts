import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
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
        const material = await Material.findById(id);
        if (!material) return errorResponse('Material not found', 404);
        return successResponse(material);
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
        if (!session || (session.user as any).role === UserRole.USER) {
            return errorResponse('Unauthorized', 401);
        }

        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const material = await Material.findById(id);
        if (!material) return errorResponse('Material not found', 404);

        // RBAC: Admin can only update their own tenant's materials
        if ((session.user as any).role === UserRole.ADMIN && material.tenantId.toString() !== (session.user as any).tenantId) {
            return errorResponse('Forbidden', 403);
        }

        const updatedMaterial = await Material.findByIdAndUpdate(id, body, { new: true });
        return successResponse(updatedMaterial);
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

        const material = await Material.findById(id);
        if (!material) return errorResponse('Material not found', 404);

        // RBAC
        if ((session.user as any).role === UserRole.ADMIN && material.tenantId.toString() !== (session.user as any).tenantId) {
            return errorResponse('Forbidden', 403);
        }

        await Material.findByIdAndDelete(id);
        return successResponse({ message: 'Material deleted successfully' });
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
