import dbConnect from './mongodb';
import Tenant, { ITenant } from '@/models/Tenant';

export async function getTenantBySlug(slug: string): Promise<ITenant | null> {
    await dbConnect();
    const tenant = await Tenant.findOne({ slug, 'settings.isActive': true }).lean();
    return tenant as ITenant | null;
}

export async function getAllTenants(): Promise<ITenant[]> {
    await dbConnect();
    const tenants = await Tenant.find({ 'settings.isActive': true }).lean();
    return tenants as ITenant[];
}

export async function getWhiteLabelTenant(): Promise<ITenant | null> {
    const slug = process.env.NEXT_PUBLIC_TENANT_SLUG;
    if (!slug) return null;
    return getTenantBySlug(slug);
}
