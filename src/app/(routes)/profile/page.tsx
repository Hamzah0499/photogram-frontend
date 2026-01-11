"use client";
import Preloader from "@/components/Preloader";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      router.replace(`/profile/${user.username}`);
    } else if (!isAuthenticated) {
      router.push("/login");
    }
  }, [user, isAuthenticated, router]);

  return <Preloader />;
}
