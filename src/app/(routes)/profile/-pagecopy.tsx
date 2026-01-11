import ProfilePageContent from "@/components/ProfilePageContent";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // const session = await auth();
  const profile = await { email: "" }
  if (!profile) {
    return redirect('/settings');
  }
  return (
    <ProfilePageContent
      ourFollow={null}
      profile={profile}
      isOurProfile={true} />
  );
}