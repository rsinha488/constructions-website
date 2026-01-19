import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import UserInquiryList from '@/components/features/UserInquiryList';

export default async function MyInquiriesPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();

    const inquiries = await Inquiry.find({ userId: (session.user as any).id })
        .populate('materialId', 'name images')
        .populate('tenantId', 'name')
        .sort({ createdAt: -1 });

    return <UserInquiryList inquiries={structuredClone(JSON.parse(JSON.stringify(inquiries)))} />;
}
