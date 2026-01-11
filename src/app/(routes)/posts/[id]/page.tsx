import SinglePostContent from "@/components/SinglePostContent";

export default function SinglePostPage() {
  const { post, authorProfile, comments, commentsAuthors, myLike, myBookmark } = {
    post: {} as any,
    authorProfile: {} as any,
    comments: [] as any[],
    commentsAuthors: [] as any[],
    myLike: {} as any,
    myBookmark: {} as any,
  };

  return (
    <SinglePostContent
      post={post}
      authorProfile={authorProfile}
      comments={comments}
      commentsAuthors={commentsAuthors}
      myLike={myLike}
      myBookmark={myBookmark}
    />
  );
}
