"use client";

import PostsGrid from "@/components/PostsGrid";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { searchUsers } from "@/api/internal/user.api";
import { usePostStore } from "@/store/usePostStore";
import Preloader from "./Preloader";

export default function SearchResults({ query }: { query: string }) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const { posts, searchPosts, isLoading: postsLoading } = usePostStore();
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setProfilesLoading(true);
      try {
        const userRes: any = await searchUsers(query);
        setProfiles(userRes.data?.data || []);
        await searchPosts(query);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setProfilesLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, searchPosts]);

  if (postsLoading || profilesLoading) return <Preloader />;

  return (
    <div>
      <h1 className="text-lg mt-4 font-semibold">
        Search results for "{query}"
      </h1>

      {profiles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Users</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {profiles.map(profile => (
              <Link
                key={profile.id}
                href={`/profile/${profile.username}`}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Avatar
                  size="3"
                  radius="full"
                  fallback={profile.username?.[0] || 'U'}
                  src={profile.avatar || ''}
                />
                <div className="overflow-hidden">
                  <h3 className="font-semibold truncate">{profile.fullname || profile.name}</h3>
                  <h4 className="text-gray-500 dark:text-gray-400 text-xs truncate">
                    @{profile.username}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Posts</h2>
        {posts.length > 0 ? (
          <PostsGrid posts={posts} />
        ) : (
          <p className="text-center text-gray-400 mt-10">No posts found matching your search.</p>
        )}
      </div>
    </div>
  );
}