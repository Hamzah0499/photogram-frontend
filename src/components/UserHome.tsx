import HomePosts from "@/components/HomePosts";
import HomeTopRow from "@/components/HomeTopRow";

export default async function UserHome({ }: { session: any }) {
  // const follows = await prisma.follower.findMany({
  //   where: {
  //     followingProfileEmail: session?.user?.email || '',
  //   },
  // });
  const follows = [{}];
  const profiles = [{}];
  return (
    <div className="flex flex-col gap-8">
      <HomeTopRow follows={follows} profiles={profiles} />
      <HomePosts follows={follows} profiles={profiles} />
    </div>
  );
}