"use client";
'use client'

import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export const HomeNavbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const pathname = usePathname();
    
    // Reset search mode when navigating to a different page
    useEffect(() => {
        setShowSearch(false);
    }, [pathname]);

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 shadow-sm">
            {/* Mobile search mode */}
            {showSearch ? (
                <div className="flex items-center w-full gap-2 px-2">
                    <button 
                        onClick={() => setShowSearch(false)} 
                        className="p-2 flex-shrink-0"
                        aria-label="Back to navigation"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <SearchInput />
                    </div>
                </div>
            ) : (
                /* Normal navigation mode */
                <div className="flex items-center gap-4 w-full">
                    {/* Menu and logo */}
                    <div className="flex items-center flex-shrink-0">
                        <SidebarTrigger />
                        <Link prefetch  href="/">
                            <div className="p-4 flex items-center gap-1">
                                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                                <p className="text-xl font-semibold tracking-tight hidden sm:block">VideoAdda</p>
                            </div>
                        </Link>
                    </div>

                    {/* Search bar - desktop only */}
                    <div className="hidden md:flex flex-1 justify-center max-w-[720px] mx-auto">
                        <SearchInput />
                    </div>

                    {/* Auth button and mobile search toggle */}
                    <div className="flex-shrink-0 items-center ml-auto flex gap-4">
                        <button 
                            onClick={() => setShowSearch(true)} 
                            className="p-2 md:hidden"
                            aria-label="Show search"
                        >
                            <Search size={24} />
                        </button>
                        <AuthButton />
                    </div>
                </div>
            )}
        </nav>
    );
}