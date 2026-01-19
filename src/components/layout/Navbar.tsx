'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Menu, X, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
    readonly tenantName: string;
    readonly slug: string;
}

export default function Navbar({ tenantName, slug }: NavbarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks = [
        { name: 'Home', href: `/${slug}` },
        { name: 'Materials', href: `/${slug}/materials` },
        { name: 'Contact', href: `/${slug}/contact` },
    ];

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href={`/${slug}`} className="text-2xl font-bold text-primary">
                        {tenantName}
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session && (
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <User className="w-4 h-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/admin' })}>
                                    Sign Out
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block py-2 text-slate-600 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                </div>
            )}
        </nav>
    );
}
