'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, } from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';

function cx(...cls) { return cls.filter(Boolean).join(' '); }

const baseBtn = 'rounded-[39px] font-semibold transition duration-500 ease-in-out';
const inactiveBtn = 'text-white bg-[#101010] hover:text-[#CBF273] hover:bg-[#023C26] hover:shadow-[0_4px_10px_rgba(203,242,115,0.1)]';
const activeBtn = 'text-[#023C26] bg-[#CBF273] shadow-[0_4px_10px_rgba(203,242,115,0.2)]';

const MENU = [
    { href: '/', label: 'Home', match: 'equals' },
    { href: '/movie', label: 'Movies', match: 'startsWith' },
    { href: '/tv', label: 'TV Series', match: 'startsWith' },
    { href: '/top-rated', label: 'Top Rated', match: 'startsWith' },
    { href: '/artist', label: 'Artist', match: 'startsWith' },
];

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (href, match = 'startsWith') => match === 'equals' ? pathname === href : pathname.startsWith(href);
    const isWatchlist = pathname.startsWith('/watch-list');
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(v => !v);
    const close = () => setOpen(false);

    useEffect(() => { if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [open]);

    return (
        <div className="sticky top-0 z-40 bg-[#0d0d0d]/80 backdrop-blur">
            <div className="w-full max-w-[1200px] mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={toggle} className="md:hidden h-10 w-10 rounded-full bg-white text-[#131313] flex items-center justify-center active:scale-95 transition" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-drawer">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="hidden md:block">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-2">
                                {MENU.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <NavigationMenuLink asChild className={cx( baseBtn, 'text-[16px] px-6 py-2', isActive(item.href, item.match) ? activeBtn : inactiveBtn )} aria-current={ isActive(item.href, item.match) ? 'page' : undefined}>
                                            <Link href={item.href}>{item.label}</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white text-[#131313] rounded-full flex items-center gap-3 md:gap-4 px-3 py-2 md:px-[20px] md:py-[7px] hover:bg-[#D3D3D3] transition">
                        <div className="flex gap-2 items-center">
                            <Avatar className="h-7 w-7 md:h-8 md:w-8">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>YA</AvatarFallback>
                            </Avatar>
                            <p className="hidden md:block text-[16px] font-semibold">
                                Yusuf Adi
                            </p>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/watch-list" className={cx( 'cursor-pointer rounded-[10px]', isWatchlist && 'bg-[#CBF273] text-[#023C26] font-semibold')}>
                            Watch List
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {open && (
                <div id="mobile-drawer" className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={close} aria-hidden="true"/>
                        <div className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] bg-[#0d0d0d] shadow-2xl p-4 flex flex-col">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>YA</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">Yusuf Adi</span>
                            </div>
                            <button onClick={close} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Close menu">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        <nav className="mt-5 flex flex-col gap-2">
                            {MENU.map((item) => (
                                <Link key={item.href} href={item.href} onClick={close} className={cx( 'px-4 py-3 rounded-2xl text-base', isActive(item.href, item.match) ? activeBtn : inactiveBtn )} >
                                {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}