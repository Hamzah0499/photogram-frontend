// src/components/ProtectedByAuth.tsx
"use client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedByAuthProps {
    children: React.ReactNode;
    redirectIfAuthenticated?: boolean;
    redirectUrl?: string;
    redirectToIfAuthenticated?: string;
}

const ProtectedByAuth = ({
    children,
    redirectIfAuthenticated = false,
    redirectUrl = "/login", // Default to login for protected pages
}: ProtectedByAuthProps) => {
    const router = useRouter();
    const { isAuthenticated } = useUserStore();

    useEffect(() => {
        if (redirectIfAuthenticated) {
            // If user is authenticated and this route (e.g. login) should be hidden
            if (isAuthenticated) {
                router.replace("/");
            }
        } else {
            // If user is NOT authenticated on a protected page
            if (!isAuthenticated) {
                router.replace(redirectUrl);
            }
        }
    }, [isAuthenticated, redirectIfAuthenticated, redirectUrl, router]);

    // If we're in a state that requires redirection, show nothing
    if (redirectIfAuthenticated ? isAuthenticated : !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedByAuth;
