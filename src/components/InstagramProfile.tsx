import { User } from "@/types/user";
import { Post } from "@/types/post";
import React, { useState } from "react";
import { Dialog } from "@radix-ui/themes";
import InstagramPost from "./single-feed-post";

type Highlight = {
    title: string;
    image: string;
};

type InstagramProfileProps = {
    // username: string;
    // fullName: string;
    // avatar: string;
    // bio: string;
    profile: User;
    website?: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    highlights: Highlight[];
    posts: Post[];
};

const InstagramProfile: React.FC<InstagramProfileProps> = ({
    // username,
    // fullName,
    // avatar,
    // bio,
    profile,
    website,
    stats,
    highlights,
    posts,
}) => {

    // console.log({
    //     // username,
    //     // fullName,
    //     // avatar,
    //     // bio,
    //     profile,
    //     website,
    //     stats,
    //     highlights,
    //     posts,
    // });
    // console.log("Profile: ", profile)

    return (
        <div className="min-h-screen">
            {/* Profile Header */}
            <section className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-[auto,1fr] gap-8">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <img
                            src={`${profile.avatar}`}
                            alt={profile.username + " profile image"}
                            className="w-24 md:w-36 aspect-square rounded-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-xl font-light">{profile.username}</h1>

                            <button className="px-4 py-1.5 text-sm font-semibold border rounded-md">
                                Edit Profile
                            </button>

                            {/* <button className="p-1">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                    <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
                                </svg>
                            </button> */}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-4 text-sm">
                            <Stat label="posts" value={stats.posts} />
                            <Stat label="followers" value={stats.followers} />
                            <Stat label="following" value={stats.following} />
                        </div>

                        {/* Bio */}
                        <div className="mt-4 text-sm">
                            <p className="font-semibold">{profile.name}</p>
                            <p>{profile.bio}</p>
                            {website && (
                                <a
                                    href={website}
                                    className="text-blue-600 dark:text-blue-400"
                                >
                                    {website}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div className="flex gap-6 overflow-x-auto py-8">
                    {highlights.map((h) => (
                        <div key={h.title} className="flex flex-col items-center shrink-0">
                            <div className="w-16 aspect-square rounded-full border p-1">
                                <img
                                    src={h.image}
                                    alt={h.title}
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xs mt-2">{h.title}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-center gap-8 text-xs font-semibold tracking-widest py-4">
                        <Tab label="POSTS" active />
                        {/* <Tab label="SAVED" /> */}
                        {/* <Tab label="TAGGED" /> */}
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {posts.map((post, i) => (
                        <Dialog.Root key={post.id || i}>
                            <Dialog.Trigger>
                                <div className="aspect-square overflow-hidden cursor-pointer group relative">
                                    <img
                                        src={post.media?.[0] || "/default-post.png"}
                                        alt={`Post ${i}`}
                                        className="w-full h-full object-cover transition duration-300 group-hover:brightness-75"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20 text-white font-semibold gap-4">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                            {post.likesCount || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                            </svg>
                                            {post.commentsCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </Dialog.Trigger>

                            <Dialog.Content maxWidth="600px" style={{ padding: 0, overflow: 'hidden' }}>
                                <InstagramPost
                                    postId={post.id}
                                    username={post.creator?.username || ""}
                                    avatar={post.creator?.avatar || ""}
                                    images={post.media || []}
                                    caption={post.caption || ""}
                                    likes={post.likesCount}
                                    commentsCount={post.commentsCount}
                                    isLiked={post.isLiked}
                                    isSaved={post.isSaved}
                                />
                            </Dialog.Content>
                        </Dialog.Root>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default InstagramProfile;

/* ---------- Helpers ---------- */

const Stat = ({ value, label }: { value: number; label: string }) => (
    <span>
        <span className="font-semibold">{value}</span> {label}
    </span>
);

const Tab = ({ label, active }: { label: string; active?: boolean }) => (
    <button
        className={`flex items-center gap-2 ${active ? "text-gray-900 dark:text-white" : "text-gray-400"
            }`}
    >
        {label}
    </button>
);
