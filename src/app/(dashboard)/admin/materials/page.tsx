import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';
import MaterialManagement from '@/components/features/MaterialManagement';

export default async function AdminMaterialsPage() {
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

    const materials = await Material.find(query).sort({ createdAt: -1 });

    return <MaterialManagement initialMaterials={structuredClone(JSON.parse(JSON.stringify(materials)))} />;
}
