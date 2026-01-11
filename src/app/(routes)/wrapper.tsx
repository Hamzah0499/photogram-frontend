"use client";

import DesktopNav from "@/components/DesktopNav.1"
import MobileNav from '@/components/MobileNav'
import { Theme } from '@radix-ui/themes'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import useAutoLogin from "@/hooks/useAutoLogin";
import Preloader from "@/components/Preloader";
import { usePathname } from "next/navigation";
import ProtectedByAuth from "@/components/ProtectedByAuth";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const loading = useAutoLogin();
    const pathname = usePathname();
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (loading) {
        return <Preloader />;
    }

    // Auth routes (Login/Register) handle their own layout/protection
    if (isAuthRoute) {
        return (
            <Theme>
                {children}
                <Toaster position='top-center' />
            </Theme>
        );
    }

    return (
        <Theme>
            <ProtectedByAuth>
                <div className="flex min-h-screen dark:bg-gray-800 dark:text-gray-300">
                    <DesktopNav />
                    <div className="pb-24 ld:pb-4 pt-4 px-4 lg:px-8 flex justify-around w-full">
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </div>
                <MobileNav />
            </ProtectedByAuth>
            <Toaster position='top-center' />
        </Theme>
    )
}
