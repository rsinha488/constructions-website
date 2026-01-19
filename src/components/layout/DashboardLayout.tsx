'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    Building2,
    ChevronRight,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';

interface SidebarLink {
    name: string;
    href: string;
    icon: React.ElementType;
    roles: UserRole[];
}

const sidebarLinks: SidebarLink[] = [
    {
        name: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: [UserRole.USER]
    },
    {
        name: 'Admin Overview',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    {
        name: 'Materials',
        href: '/admin/materials',
        icon: Package,
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    {
        name: 'Quotations',
        href: '/admin/quotations',
        icon: FileText,
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    {
        name: 'Inquiries',
        href: '/admin/inquiries',
        icon: MessageSquare,
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    {
        name: 'My Inquiries',
        href: '/dashboard/inquiries',
        icon: MessageSquare,
        roles: [UserRole.USER]
    },
    {
        name: 'Tenants',
        href: '/super-admin/tenants',
        icon: Building2,
        roles: [UserRole.SUPER_ADMIN]
    },
    {
        name: 'Users',
        href: '/super-admin/users',
        icon: Users,
        roles: [UserRole.SUPER_ADMIN]
    },
    {
        name: 'Company Settings',
        href: '/admin/settings/company',
        icon: Building2,
        roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
];

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const userRole = (session?.user as any)?.role as UserRole;

    const filteredLinks = sidebarLinks.filter(link => link.roles.includes(userRole));

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">C</div>
                        CONSTRUCT
                    </Link>
                </div>

                <nav className="flex-grow px-4 space-y-1">
                    {filteredLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                {link.name}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => signOut({ callbackUrl: '/admin' })}
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <button
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden w-full h-full border-none p-0 cursor-default"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-8 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">C</div>
                        CONSTRUCT
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                <nav className="px-4 space-y-1">
                    {filteredLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 text-slate-600"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">{session?.user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{userRole?.toLowerCase().replace('_', ' ')}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                            <UserIcon className="w-6 h-6" />
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-8 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
