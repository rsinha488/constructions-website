import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/features/UserManagement';

export default async function SuperAdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (user.role !== UserRole.SUPER_ADMIN) {
        redirect('/admin');
    }

    await dbConnect();

    const users = await User.find()
        .populate('tenantId', 'name')
        .sort({ createdAt: -1 });

    return <UserManagement initialUsers={structuredClone(JSON.parse(JSON.stringify(users)))} />;
}
