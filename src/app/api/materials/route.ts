import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const tenantId = searchParams.get('tenantId');
        const category = searchParams.get('category');

        const query: any = { isActive: true };
        if (tenantId) query.tenantId = tenantId;
        if (category) query.category = category;

        const materials = await Material.find(query).sort({ createdAt: -1 });
        return successResponse(materials);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role === UserRole.USER) {
            return errorResponse('Unauthorized', 401);
        }

        await dbConnect();
        const body = await req.json();

        // Ensure admin only creates for their tenant
        if ((session.user as any).role === UserRole.ADMIN) {
            body.tenantId = (session.user as any).tenantId;
        }

        const material = await Material.create(body);
        return successResponse(material, 201);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
