import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getFeed, likePost, savePost } from "@/api/internal/post.api";
import { Post, PostState } from "@/types/post";
import { AxiosResponseType } from "@/types/AxiosResponse";
import toast from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const usePostStore = create<PostState>()(
    (set) => ({
        posts: [],
        isLoading: false,
        error: null,

        fetchFeed: async () => {
            set({ isLoading: true, error: null });
            try {
                const response: any = await getFeed();
                const rawPosts = response.data?.data || [];
                const currentUserId = useUserStore.getState().user?.id;

                const posts = rawPosts.map((post: any) => ({
                    ...post,
                    isLiked: Array.isArray(post.likedUsers)
                        ? post.likedUsers.some((u: any) => u.userId === currentUserId)
                        : post.likedUsers?.userId === currentUserId,
                    isSaved: Array.isArray(post.bookmarkedUsers)
                        ? post.bookmarkedUsers.some((u: any) => u.userId === currentUserId)
                        : post.bookmarkedUsers?.userId === currentUserId
                }));

                set({ posts, isLoading: false });
            } catch (error: any) {
                console.error("Failed to fetch feed:", error);
                set({
                    isLoading: false,
                    error: error.message || "Failed to fetch posts"
                });
            }
        },

        addPost: (post) => set((state) => ({
            posts: [post, ...state.posts]
        })),

        setPosts: (posts) => set({ posts }),

        toggleLike: async (postId: number) => {


            try {
                const response: any = await likePost(postId);
                console.log("Post : ", response.data)
                if (response.data.isSuccess) {
                    set((state) => ({
                        posts: state.posts.map((p) =>
                            p.id === postId
                                ? {
                                    ...p,
                                    isLiked: !p.isLiked,
                                    likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                                }
                                : p
                        ),
                    }));
                    toast.success(response.data.data.message)
                }
            } catch (error) {
                // Rollback on error
                set((state) => ({
                    posts: state.posts.map((p) =>
                        p.id === postId
                            ? {
                                ...p,
                                isLiked: !p.isLiked,
                                likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                            }
                            : p
                    ),
                }));
            }
        },

        toggleSave: async (postId: number) => {
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === postId ? { ...p, isSaved: !p.isSaved } : p
                ),
            }));

            try {
                const response: any = await savePost(postId);
                if (response.data.isSuccess) {
                    set((state) => ({
                        posts: state.posts.map((p) =>
                            p.id === postId
                                ? {
                                    ...p,
                                    isLiked: !p.isLiked,
                                    likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                                }
                                : p
                        ),
                    }));
                    toast.success(response.data.data.message)
                }
            } catch (error) {
                set((state) => ({
                    posts: state.posts.map((p) =>
                        p.id === postId ? { ...p, isSaved: !p.isSaved } : p
                    ),
                }));
            }
        },

        addComment: async (postId: number, content: string) => {
            try {
                const { addComment } = await import("@/api/internal/post.api");
                const response: any = await addComment(postId, content);

                if (response.data?.success || response.success) {
                    set((state) => ({
                        posts: state.posts.map((p) =>
                            p.id === postId
                                ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                                : p
                        ),
                    }));
                }
            } catch (error) {
                console.error("Failed to add comment:", error);
                throw error;
            }
        },

        addReply: async (commentId: number, postId: number, content: string) => {
            try {
                const { addReply } = await import("@/api/internal/post.api");
                const response: any = await addReply(commentId, content);

                if (response.data?.success || response.success) {
                    set((state) => ({
                        posts: state.posts.map((p) =>
                            p.id === postId
                                ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                                : p
                        ),
                    }));
                }
            } catch (error) {
                console.error("Failed to add reply:", error);
                throw error;
            }
        },

        fetchComments: async (postId: number) => {
            try {
                const { getComments } = await import("@/api/internal/post.api");
                const response: any = await getComments(postId);
                const comments = response.data?.data || [];

                set((state) => ({
                    posts: state.posts.map((p) =>
                        p.id === postId ? { ...p, comments } : p
                    ),
                }));
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        },

        fetchUserPosts: async (username: string) => {
            set({ isLoading: true, error: null });
            try {
                const { getPostsByUsername } = await import("@/api/internal/post.api");
                const response: any = await getPostsByUsername(username);
                const rawPosts = response.data?.data || [];
                const currentUserId = useUserStore.getState().user?.id;

                const posts = rawPosts.map((post: any) => ({
                    ...post,
                    isLiked: Array.isArray(post.likedUsers)
                        ? post.likedUsers.some((u: any) => u.userId === currentUserId)
                        : post.likedUsers?.userId === currentUserId
                }));

                set({ posts, isLoading: false });
            } catch (error: any) {
                console.error("Failed to fetch user posts:", error);
                set({ isLoading: false, error: error.message });
            }
        },

        fetchExplorePosts: async () => {
            set({ isLoading: true, error: null });
            try {
                const { getExplorePosts } = await import("@/api/internal/post.api");
                const response: any = await getExplorePosts();
                const rawPosts = response.data?.data || [];
                const currentUserId = useUserStore.getState().user?.id;

                const posts = rawPosts.map((post: any) => ({
                    ...post,
                    isLiked: Array.isArray(post.likedUsers)
                        ? post.likedUsers.some((u: any) => u.userId === currentUserId)
                        : post.likedUsers?.userId === currentUserId
                }));

                set({ posts, isLoading: false });
            } catch (error: any) {
                console.error("Failed to fetch explore posts:", error);
                set({ isLoading: false, error: error.message });
            }
        },

        searchPosts: async (query: string) => {
            set({ isLoading: true, error: null });
            try {
                const { searchPosts } = await import("@/api/internal/post.api");
                const response: any = await searchPosts(query);
                const rawPosts = response.data?.data || [];
                const currentUserId = useUserStore.getState().user?.id;

                const posts = rawPosts.map((post: any) => ({
                    ...post,
                    isLiked: Array.isArray(post.likedUsers)
                        ? post.likedUsers.some((u: any) => u.userId === currentUserId)
                        : post.likedUsers?.userId === currentUserId
                }));

                set({ posts, isLoading: false });
            } catch (error: any) {
                console.error("Failed to search posts:", error);
                set({ isLoading: false, error: error.message });
            }
        },
    })
);
