import { usePostStore } from "@/store/usePostStore";
import React, { useState } from "react";
import toast from "react-hot-toast";

type InstagramPostProps = {
    postId: number;
    username: string;
    avatar: string;
    images: string[]; // ✅ multiple images
    caption: string;
    likes?: string | number;
    commentsCount?: number;
    isLiked?: boolean;
    isSaved?: boolean;
};

// type ActionType = "like" | "comment" | "share" | "save";
type ActionType = "like" | "comment" | "save";

const InstagramPost: React.FC<InstagramPostProps> = ({
    postId,
    username,
    avatar,
    images,
    caption,
    likes = "0",
    commentsCount = 0,
    isLiked = false,
    isSaved = false,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: number, username: string } | null>(null);

    const { posts, toggleLike, toggleSave, addComment, addReply, fetchComments } = usePostStore();
    const currentPost = posts.find((p) => p.id === postId);
    const comments = currentPost?.comments || [];

    const hasMultipleImages = images?.length > 1;

    const next = () => setActiveIndex((i) => (i + 1) % images.length);
    const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

    const handleLike = () => {
        toggleLike(postId);
    };

    const handleSave = () => {
        toggleSave(postId);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            if (replyTo) {
                await addReply(replyTo.id, postId, commentText);
            } else {
                await addComment(postId, commentText);
            }
            setCommentText("");
            setReplyTo(null);
            if (showComments) fetchComments(postId); // Refresh comments list
            toast.success(replyTo ? "Reply added!" : "Comment added!");
        } catch (error) {
            toast.error(replyTo ? "Failed to add reply." : "Failed to add comment.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleViewComments = () => {
        if (!showComments) fetchComments(postId);
        setShowComments(!showComments);
        console.log("Comments: ", comments)
    };

    return (
        <article className="w-full max-w-xl mx-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {/* Header ... same as before */}
            <header className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={avatar || "https://i.pravatar.cc/150"}
                        alt={`${username} avatar`}
                        className="aspect-square w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                        {username}
                    </span>
                </div>

                <button className="text-gray-700 dark:text-gray-300">
                    <svg viewBox="0 0 512 512" width="20" height="20">
                        <g fill="currentColor">
                            <circle cx="458.667" cy="256" r="53.333" />
                            <circle cx="256" cy="256" r="53.333" />
                            <circle cx="53.333" cy="256" r="53.333" />
                        </g>
                    </svg>
                </button>
            </header>

            {/* Images / Carousel ... same as before */}
            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <div
                    className="flex transition-transform duration-300"
                    style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                    }}
                >
                    {images?.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Post image ${i + 1}`}
                            className="w-full flex-shrink-0 object-contain aspect-square"
                        />
                    ))}
                </div>

                {hasMultipleImages && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ‹
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ›
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${i === activeIndex ? "bg-blue-500" : "bg-gray-300"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <section className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <ActionButton type="like" isActive={isLiked} onClick={handleLike} />
                    <ActionButton type="comment" onClick={handleViewComments} />
                    {/* <ActionButton type="share" /> */}
                </div>
                <ActionButton type="save" isActive={isSaved} onClick={handleSave} />
            </section>

            <div className="px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {likes} likes
            </div>

            <div className="px-4 pt-1 text-sm text-gray-900 dark:text-gray-100">
                <span className="font-semibold mr-1">{username}</span>
                {caption}
            </div>

            {commentsCount > 0 && (
                <div
                    onClick={handleViewComments}
                    className="px-4 pt-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
                >
                    {showComments ? "Hide comments" : `View all ${commentsCount} comments`}
                </div>
            )}

            {showComments && (
                <div className="px-4 py-2 space-y-3 max-h-60 overflow-y-auto border-t border-gray-50 dark:border-gray-900 mt-2 pt-3">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="text-sm group">
                            <div className="flex items-start gap-2">
                                <img src={comment.user.avatar} className="w-6 h-6 rounded-full object-cover mt-0.5" alt="" />
                                <div className="flex-1">
                                    <p className="text-gray-900 dark:text-gray-100">
                                        <span className="font-semibold mr-2">{comment.user.username}</span>
                                        {comment.text}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="capitalize">Sentiment: {comment.sentiment}</span>
                                        <span>-</span>
                                        <span>{new Date(comment.createdAt).toDateString()}</span>
                                        <button
                                            onClick={() => {
                                                setReplyTo({ id: comment.id, username: comment.user?.username });
                                                // Scroll to input would be nice but simple set for now
                                            }}
                                            className="font-semibold hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            Reply
                                        </button>
                                    </div>

                                    {/* Sub-replies could go here */}
                                    {comment.replies?.map((reply: any) => (
                                        <div key={reply.id} className="flex items-start gap-2 mt-2 ml-4">
                                            <img src={reply.avatar} className="w-5 h-5 rounded-full object-cover mt-0.5" alt="" />
                                            <div className="flex-1">
                                                <p className="text-gray-900 dark:text-gray-100 text-xs">
                                                    <span className="font-semibold mr-2">{reply.username}</span>
                                                    {reply.text}

                                                </p>
                                                <span className=" text-xs text-gray-500">{new Date(reply.createdAt).toDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-xs text-center text-gray-500">No comments yet.</p>}
                </div>
            )}

            {replyTo && (
                <div className="px-4 py-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500">
                    <span>Replying to @{replyTo.username}</span>
                    <button onClick={() => setReplyTo(null)} className="font-bold">✕</button>
                </div>
            )}

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                <img
                    src={avatar || "https://i.pravatar.cc/150"}
                    alt="Your avatar"
                    className="aspect-square w-7 rounded-full object-cover"
                />
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={replyTo ? `Reply to @${replyTo.username}...` : "Add a comment…"}
                    className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                />
                <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className={`text-sm font-semibold text-blue-500 ${(!commentText.trim() || isSubmittingComment) ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"}`}
                >
                    {isSubmittingComment ? "..." : "Post"}
                </button>
            </form>
        </article>
    );
};

export default InstagramPost;

/* ---------------- Icons ---------------- */

type ActionButtonProps = {
    type: ActionType;
    isActive?: boolean;
    onClick?: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ type, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`transition hover:opacity-70 ${isActive && type === 'like' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
    >
        <ActionIcon type={type} isActive={isActive} />
    </button>
);

const ActionIcon = ({ type, isActive }: { type: ActionType, isActive?: boolean }) => {
    const icons: Record<ActionType, JSX.Element> = {
        like: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
        comment: <path d="M21 12c0 4.971-4.029 9-9 9-1.293 0-2.548-.273-3.7-.793l-4.72.786 1.49-3.26A8.959 8.959 0 013 12c0-4.971 4.029-9 9-9s9 4.029 9 9z" />,
        // share: <path d="M12 3v12M12 3l4 4M12 3L8 7M4 13v4c0 2.5 3.5 2.5 8 2.5s8 0 8-2.5v-4" />,
        save: <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
    };

    return (
        <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill={isActive ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {icons[type]}
        </svg>
    );
};

