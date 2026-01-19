import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Tenant from '@/models/Tenant';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';
import TenantManagement from '@/components/features/TenantManagement';

export default async function SuperAdminTenantsPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = session.user as any;
    if (user.role !== UserRole.SUPER_ADMIN) {
        redirect('/admin');
    }

    await dbConnect();

    const tenants = await Tenant.find().sort({ createdAt: -1 });

    return <TenantManagement initialTenants={structuredClone(JSON.parse(JSON.stringify(tenants)))} />;
}
