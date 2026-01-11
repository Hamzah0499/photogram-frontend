'use client';
import { BookmarkIcon } from "lucide-react";

export default function BookmarkButton({
}: {
  post: any;
  sessionBookmark?: any | null;
}) {
  // const router = useRouter();
  // const [bookmarkedByMe, setBookmarkedByMe] = useState(!!sessionBookmark);
  return (
    <form
      // action={async (data: FormData) => {
      //   setBookmarkedByMe(prev => !prev);
      //   if (bookmarkedByMe) {
      //     // remove bookmark
      //     // await unbookmarkPost(post.id);
      //   } else {
      //     // add bookmark
      //     // await bookmarkPost(post.id);
      //   }
      //   router.refresh();
      // }}
      className="flex items-center gap-2">
      <input type="hidden" name="postId" value={2} />
      <button
        type="submit"
        className="">
        <BookmarkIcon className={false ? 'fill-gray-800 dark:text-white dark:fill-white' : 'dark:text-white'} />
      </button>
    </form>
  );
}