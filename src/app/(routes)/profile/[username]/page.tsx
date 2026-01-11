"use client";
import { getUserProfile } from "@/api/internal/user.api";
import InstagramProfile from "@/components/InstagramProfile";
import Preloader from "@/components/Preloader";
import ProtectedByAuth from "@/components/ProtectedByAuth";
import { useUserStore } from "@/store/useUserStore";
import { usePostStore } from "@/store/usePostStore";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfilePage() {
    const { username } = useParams();
    const { user: currentUser } = useUserStore();
    const { posts, fetchUserPosts, isLoading: postsLoading } = usePostStore();
    const [profile, setProfile] = useState<User | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (typeof username !== "string") return;

            setProfileLoading(true);
            try {
                const loadedProfile: any = await getUserProfile(username);
                setProfile(loadedProfile.data.data);
                await fetchUserPosts(username);
            } catch (error) {
                console.error("Failed to load profile", error);
                toast.error("User not found");
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfileData();
    }, [username, fetchUserPosts]);

    if (profileLoading) return <Preloader />;

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-gray-500">The user you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <ProtectedByAuth>
            <main className="min-h-screen">
                <InstagramProfile
                    profile={profile}
                    stats={{
                        posts: posts.length,
                        followers: profile.followersCount || 0,
                        following: profile.followingCount || 0,
                    }}
                    highlights={[]}
                    posts={posts}
                />
            </main>
        </ProtectedByAuth>
    );
}
