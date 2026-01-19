import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const tenants = await Tenant.find({ 'settings.isActive': true });
        return successResponse(tenants);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return errorResponse('Forbidden', 403);
        }

        await dbConnect();
        const body = await req.json();
        const tenant = await Tenant.create(body);
        return successResponse(tenant, 201);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
