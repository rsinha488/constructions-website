import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import { uploadImage } from '@/lib/cloudinary';

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
        const tenant = await Tenant.findById(user.tenantId);
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        // Check image limit (50 images)
        const IMAGE_LIMIT = 50;
        if (tenant.settings.imageCount >= IMAGE_LIMIT) {
            return NextResponse.json({
                error: 'LIMIT_REACHED',
                message: 'You have reached the limit of 50 images. Please upgrade your plan to upload more.'
            }, { status: 403 });
        }

        const data = await req.json();
        const { file, folder } = data;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const uploadResponse = await uploadImage(file, folder || 'general');

        // Increment image count
        tenant.settings.imageCount += 1;
        await tenant.save();

        return NextResponse.json({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            imageCount: tenant.settings.imageCount
        });

    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
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
        const tenant = await Tenant.findById(user.tenantId);
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
        }

        // Delete from Cloudinary
        // We need to import deleteImage from lib/cloudinary
        const { deleteImage } = await import('@/lib/cloudinary');
        await deleteImage(publicId);

        // Decrement image count
        if (tenant.settings.imageCount > 0) {
            tenant.settings.imageCount -= 1;
            await tenant.save();
        }

        return NextResponse.json({ success: true, imageCount: tenant.settings.imageCount });

    } catch (error: any) {
        console.error('Delete API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
