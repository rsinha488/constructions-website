'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Menu, X, User, ShieldCheck } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { UserRole } from '@/types';

export default function GlobalNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = React.useState(false);

    const isAdmin = session?.user && ((session.user as any).role === UserRole.ADMIN || (session.user as any).role === UserRole.SUPER_ADMIN);
    const isSuperAdmin = session?.user && (session.user as any).role === UserRole.SUPER_ADMIN;

    const isWhiteLabel = !!process.env.NEXT_PUBLIC_TENANT_SLUG;

    const navLinks = [
        { name: 'Home', href: '/' },
        ...(isWhiteLabel ? [
            { name: 'Materials', href: '#materials' },
            { name: 'Solutions', href: '#solutions' },
            { name: 'Testimonials', href: '#testimonials' },
        ] : [
            { name: 'Companies', href: '/#companies' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Materials', href: '/#materials' },
            { name: 'Testimonials', href: '/#testimonials' },
        ]),
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg">C</div>
                        CONSTRUCT
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors hover:text-slate-900 ${pathname === link.href ? 'text-slate-900' : 'text-slate-500'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        {session && (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link href={isSuperAdmin ? "/super-admin" : "/admin/dashboard"}>
                                        <Button variant="ghost" size="sm" className="gap-2 text-slate-700">
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-2 text-slate-700">
                                        <User className="w-4 h-4" />
                                        Account
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/admin' })}>
                                    Sign Out
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block py-2 text-slate-600 font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                        {session && (
                            <>
                                {isAdmin && (
                                    <Link href={isSuperAdmin ? "/super-admin" : "/admin/dashboard"} className="block">
                                        <Button variant="ghost" className="w-full justify-start gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/dashboard" className="block">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <User className="w-4 h-4" />
                                        Account
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/admin' })}>
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
