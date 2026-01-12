export default function Avatar({
  src,
}: {
  src: string;
}) {
  return (
    <div className="size-16 aspect-square overflow-hidden rounded-full">
      {src ? (
        <img
          src={src}
          alt="" />
      ) : (
        <p className='h-4 w-4 rounded-full bg-gray-500'>
          Nil
        </p>
      )}
    </div>
  );
}