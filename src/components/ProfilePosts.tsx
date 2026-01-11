import PostsGrid from "@/components/PostsGrid";

export default async function ProfilePosts({ email }: { email: string }) {
  // const posts = await prisma.post.findMany({ where: { author: email } });
  const posts = [{}, {}];
  return (
    <PostsGrid posts={posts} />
  );
}