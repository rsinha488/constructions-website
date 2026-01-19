import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import Tenant from '@/models/Tenant';
import User from '@/models/User';
import Material from '@/models/Material';
import Testimonial from '@/models/Testimonial';
import Inquiry from '@/models/Inquiry';
import { UserRole } from '@/types';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }

    await dbConnect();

    console.log('Seeding database...');

    // Clear existing data
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await Material.deleteMany({});
    await Testimonial.deleteMany({});
    await Inquiry.deleteMany({});

    // Create Super Admin
    const hashedSuperAdminPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedSuperAdminPassword,
        role: UserRole.SUPER_ADMIN,
    });

    console.log('Super Admin created:', superAdmin.email);

    // Create Tenants
    const tenantA = await Tenant.create({
        name: 'BuildRight Construction',
        slug: 'buildright',
        branding: {
            primaryColor: '#1e3a8a', // Blue 900
            secondaryColor: '#60a5fa', // Blue 400
            accentColor: '#f59e0b', // Amber 500
            fontFamily: 'Inter',
        },
        contact: {
            email: 'contact@buildright.com',
            phone: '123-456-7890',
            address: '123 Construction Way, Builder City',
        },
    });

    const tenantB = await Tenant.create({
        name: 'SteelStrong Contracting',
        slug: 'steelstrong',
        branding: {
            primaryColor: '#374151', // Gray 700
            secondaryColor: '#9ca3af', // Gray 400
            accentColor: '#ef4444', // Red 500
            fontFamily: 'Roboto',
        },
        contact: {
            email: 'info@steelstrong.com',
            phone: '987-654-3210',
            address: '456 Steel St, Iron Town',
        },
    });

    const tenantC = await Tenant.create({
        name: 'Jindal Enterprises Constructions',
        slug: 'jindal-enterprises',
        branding: {
            primaryColor: '#065f46', // Emerald 800
            secondaryColor: '#34d399', // Emerald 400
            accentColor: '#fbbf24', // Amber 400
            fontFamily: 'Outfit',
        },
        contact: {
            email: 'info@jindalenterprises.com',
            phone: '+91 98765 43210',
            address: '789 Jindal Plaza, Industrial Area, Phase II, New Delhi',
        },
        settings: {
            isActive: true,
            features: ['Bulk Delivery', 'Quality Testing', 'Project Consultation', 'Custom Mixes'],
        },
    });

    console.log('Tenants created:', tenantA.slug, tenantB.slug, tenantC.slug);

    // Create Tenant Admins
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    await User.create({
        name: 'BuildRight Admin',
        email: 'admin@buildright.com',
        password: hashedAdminPassword,
        role: UserRole.ADMIN,
        tenantId: tenantA._id,
    });

    await User.create({
        name: 'SteelStrong Admin',
        email: 'admin@steelstrong.com',
        password: hashedAdminPassword,
        role: UserRole.ADMIN,
        tenantId: tenantB._id,
    });

    await User.create({
        name: 'Jindal Admin',
        email: 'admin@meeraenterprises.com',
        password: hashedAdminPassword,
        role: UserRole.ADMIN,
        tenantId: tenantC._id,
    });

    console.log('Tenant Admins created');

    // Add Materials for Jindal Enterprises
    await Material.create([
        {
            name: 'Premium Portland Cement',
            description: 'High-strength Portland cement suitable for all general construction work. Provides excellent durability and finish.',
            category: 'Cement',
            price: 450,
            tenantId: tenantC._id,
            images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'],
            specifications: [
                { key: 'Grade', value: 'OPC 53' },
                { key: 'Weight', value: '50kg' },
                { key: 'Setting Time', value: '30-600 mins' },
            ],
        },
        {
            name: 'Ready-Mix Concrete (M25)',
            description: 'High-quality ready-mix concrete for structural elements. Delivered fresh to your site with guaranteed strength.',
            category: 'Concrete',
            price: 5500,
            tenantId: tenantC._id,
            images: ['https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=800'],
            specifications: [
                { key: 'Grade', value: 'M25' },
                { key: 'Slump', value: '100-120mm' },
                { key: 'Delivery', value: 'Transit Mixer' },
            ],
        },
        {
            name: 'Hot Mix Asphalt',
            description: 'Premium grade hot mix asphalt for road construction and paving. Excellent weather resistance and smooth finish.',
            category: 'Asphalt',
            price: 12000,
            tenantId: tenantC._id,
            images: ['/images/materials/hot-mix-asphalt.png'],
            specifications: [
                { key: 'Type', value: 'Bituminous Concrete' },
                { key: 'Temp', value: '150-160°C' },
            ],
        },
        {
            name: 'TMT Steel Bars',
            description: 'High-ductility TMT bars for superior earthquake resistance. Corrosion-resistant and high-bond strength.',
            category: 'Steel',
            price: 65000,
            tenantId: tenantC._id,
            images: ['https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800'],
            specifications: [
                { key: 'Type', value: 'Fe 500D' },
                { key: 'Diameter', value: '12mm' },
                { key: 'Standard', value: 'IS 1786' },
            ],
        },
        {
            name: 'Red Clay Bricks',
            description: 'Traditional kiln-fired red clay bricks for durable wall construction. Uniform size and high compressive strength.',
            category: 'Bricks',
            price: 8,
            tenantId: tenantC._id,
            images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
            specifications: [
                { key: 'Size', value: '9 x 4 x 3 inches' },
                { key: 'Compressive Strength', value: '7.5 N/mm2' },
                { key: 'Water Absorption', value: '< 20%' },
            ],
        },
        {
            name: 'River Sand (Washed)',
            description: 'Clean, silt-free river sand for plastering and masonry work. Sourced responsibly and filtered for quality.',
            category: 'Sand',
            price: 1800,
            tenantId: tenantC._id,
            images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800'],
            specifications: [
                { key: 'Type', value: 'Natural River Sand' },
                { key: 'Zone', value: 'Zone II' },
            ],
        },
    ]);

    console.log('Materials for Jindal Enterprises created');

    // Add Testimonials
    await Testimonial.create([
        {
            tenantId: tenantA._id,
            userName: 'John Smith',
            userRole: 'Project Manager, Skyline Corp',
            content: 'BuildRight provided excellent materials for our high-rise project. Their logistical support and quality assurance are top-notch.',
            rating: 5,
        },
        {
            tenantId: tenantB._id,
            userName: 'Sarah Williams',
            userRole: 'Lead Architect, Urban Designs',
            content: 'The steel quality from SteelStrong is unmatched. Their contracting team is also very professional and adheres to strict timelines.',
            rating: 5,
        },
        {
            tenantId: tenantC._id,
            userName: 'Amit Kumar',
            userRole: 'Home Owner',
            content: 'Jindal Enterprises made my home construction worry-free. Great quality cement and bricks, and their customer service is superb.',
            rating: 5,
        },
        {
            tenantId: tenantC._id,
            userName: 'Rajesh Khanna',
            userRole: 'Civil Contractor',
            content: 'The Ready-Mix Concrete from Jindal Enterprises is consistently high quality. It has significantly speeded up our slab casting process.',
            rating: 5,
        },
        {
            tenantId: tenantC._id,
            userName: 'Priya Sharma',
            userRole: 'Interior Designer',
            content: 'I always recommend Jindal Enterprises for their premium finishing materials. Their attention to detail is what sets them apart.',
            rating: 4,
        },
    ]);

    console.log('Testimonials created');

    console.log('Seeding completed!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
