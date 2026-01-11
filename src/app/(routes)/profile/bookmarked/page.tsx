import PostsGrid from "@/components/PostsGrid";
import ProfileNav from "@/components/ProfileNav";
import ProfilePageInfo from "@/components/ProfilePageInfo";
import { redirect } from "next/navigation";

export default async function BookmarkedPage() {
  // const session = await auth();
  const profile = { username: "asherfraz" }
  if (!profile) {
    return redirect('/settings');
  }
  const posts = [{}]
  return (
    <div>
      <ProfilePageInfo
        profile={profile}
        isOurProfile={true}
        ourFollow={null} />
      <ProfileNav
        username={profile.username || ''}
        isOurProfile={true} />
      <div className="mt-4">
        <PostsGrid posts={posts} />
      </div>
    </div>
  );
}