import { axiosTryCatch } from "@/utils/axiosTryCatch";
import axiosApi from "@/api/axiosInstance";

export const createPost = async (data: FormData) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.post("/post", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    })

    return response;
}

export const getFeed = async () => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.get("/post/");
    });
    return response;
};

export const likePost = async (postId: number) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.post(`/post/reactions/${postId}`);
    });
    return response;
};

export const savePost = async (postId: number) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.post(`/post/bookmarks/toggle/${postId}`);
    });
    return response;
};

export const addComment = async (postId: number, text: string) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.post(`/post/comments/${postId}`, { text });
    });
    return response;
};

export const addReply = async (commentId: number, text: string) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.post(`/post/replies/${commentId}`, { text });
    });
    return response;
};

export const getComments = async (postId: number) => {
    const response = axiosTryCatch(async () => {
        return await axiosApi.get(`/post/comments/${postId}`);
    });
    return response;
};

export const getExplorePosts = async () => {
    return axiosTryCatch(async () => {
        return await axiosApi.get("/post/explore");
    });
};

export const searchPosts = async (query: string) => {
    return axiosTryCatch(async () => {
        return await axiosApi.get(`/post/search?query=${query}`);
    });
};

export const getPostsByUsername = async (username: string) => {
    return axiosTryCatch(async () => {
        return await axiosApi.get(`/post/user/${username}`);
    });
};
