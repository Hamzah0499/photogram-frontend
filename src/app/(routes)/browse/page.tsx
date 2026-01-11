"use client";

import PostsGrid from "@/components/PostsGrid";
import Preloader from "@/components/Preloader";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";

export default function BrowsePage() {
  const { posts, fetchExplorePosts, isLoading } = usePostStore();

  useEffect(() => {
    fetchExplorePosts();
  }, [fetchExplorePosts]);

  if (isLoading) return <Preloader />;

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-gray-500">Check trending posts and find some inspiration</p>
      </div>
      <PostsGrid posts={posts} />
    </div>
  );
}