import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';
import InquiryManagement from '@/components/features/InquiryManagement';

export default async function AdminInquiriesPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        redirect('/dashboard');
    }

    await dbConnect();

    const query: any = {};
    if (user.role === UserRole.ADMIN) {
        query.tenantId = user.tenantId;
    }

    const inquiries = await Inquiry.find(query)
        .populate('materialId', 'name')
        .sort({ createdAt: -1 });

    return <InquiryManagement initialInquiries={structuredClone(JSON.parse(JSON.stringify(inquiries)))} />;
}
