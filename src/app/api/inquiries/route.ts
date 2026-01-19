import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return errorResponse('Unauthorized', 401);

        await dbConnect();
        const user = session.user as any;

        const query: any = {};
        if (user.role === UserRole.ADMIN) {
            query.tenantId = user.tenantId;
        } else if (user.role === UserRole.USER) {
            query.userId = user.id;
        }
        // SUPER_ADMIN sees all

        const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
        return successResponse(inquiries);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const session = await getServerSession(authOptions);

        if (session) {
            body.userId = (session.user as any).id;
        }

        const inquiry = await Inquiry.create(body);
        return successResponse(inquiry, 201);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}
