import CommentForm from "@/components/CommentForm";

export default async function SessionCommentForm({ postId }: { postId: string }) {
  // const session = await auth();
  // const profile = await prisma.profile.findFirstOrThrow({
  //   where: { email: session?.user?.email as string },
  // });
  const profile = { avatar: "" }
  return (
    <CommentForm postId={postId} avatar={profile.avatar || ''} />
  );
}