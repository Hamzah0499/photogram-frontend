"use client"

import Preloader from "@/components/Preloader";
import InstagramPost from "@/components/single-feed-post";
import { usePostStore } from "@/store/usePostStore";
import { useEffect } from "react";

export default function Home() {
  const { posts, fetchFeed, isLoading } = usePostStore();

  useEffect(() => {
    fetchFeed();
    console.log("posts: ", posts)
  }, [fetchFeed]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 pb-20">
      {posts?.map((post) => (
        <InstagramPost
          key={post.id}
          postId={post.id}
          username={post.creator?.username || "Unknown"}
          avatar={post.creator?.avatar || ""}
          images={post.media || []}
          caption={post.caption}
          likes={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={post.isLiked}
          isSaved={post.isSaved}
        />
      ))}
      {posts?.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>No posts yet.</p>
          <p className="text-sm">Follow creators to see their posts here!</p>
        </div>
      )}
    </div>
  );
}
