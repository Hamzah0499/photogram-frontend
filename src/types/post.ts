export interface Post {
    id: number; // Changed from _id to id
    caption: string;
    media: string[]; // URLs of images/videos
    location?: string;

    // Author info often comes populated
    creator: {
        id: number;
        username: string;
        avatar: string; // URL
        name?: string;
    };

    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;

    // Add other fields as needed based on backend response
    isLiked?: boolean; // If current user liked it
    isSaved?: boolean;

    comments?: Comment[];
}

export interface Comment {
    id: number;
    content: string;
    postId: number;
    creator: {
        id: number;
        username: string;
        avatar: string;
    };
    replies?: Comment[];
    createdAt: string;
}

export interface PostState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchFeed: () => Promise<void>;
    addPost: (post: Post) => void;
    setPosts: (posts: Post[]) => void;
    toggleLike: (postId: number) => Promise<void>;
    toggleSave: (postId: number) => Promise<void>;
    addComment: (postId: number, content: string) => Promise<void>;
    addReply: (commentId: number, postId: number, content: string) => Promise<void>;
    fetchComments: (postId: number) => Promise<void>;
    fetchUserPosts: (username: string) => Promise<void>;
    fetchExplorePosts: () => Promise<void>;
    searchPosts: (query: string) => Promise<void>;
}
