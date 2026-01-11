"use client";

import { createPost } from "@/api/internal/post.api";
import Preloader from "@/components/Preloader";
import ProtectedByAuth from "@/components/ProtectedByAuth";
import { createPostSchema, CreatePostInput } from "@/lib/validators/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { CloudUploadIcon, PlusIcon, SendIcon, XIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > 10) {
      toast.error("You can only upload a maximum of 10 files.");
      return;
    }

    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video.`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB).`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => {
      const updated = [...prev, ...validFiles];
      // Sync with react-hook-form (mocking FileList)
      const dataTransfer = new DataTransfer();
      updated.forEach(f => dataTransfer.items.add(f));
      setValue("files", dataTransfer.files, { shouldValidate: true });
      return updated;
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      updated.forEach(f => dataTransfer.items.add(f));
      setValue("files", dataTransfer.files, { shouldValidate: true });
      return updated;
    });
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (data.caption) formData.append("caption", data.caption);
      if (data.location) formData.append("location", data.location);
      if (data.people) formData.append("people", data.people);

      // Append files directly from our state source of truth
      selectedFiles.forEach((file) => {
        formData.append("media", file); // Backend expects 'files' array in Multer
      });

      const response: any = await createPost(formData);
      if (response.data?.data) {
        const { usePostStore } = await import("@/store/usePostStore");
        usePostStore.getState().addPost(response.data.data);
      }
      toast.success("Post created successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFiles = selectedFiles.length > 0;

  return (
    <ProtectedByAuth>
      <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* File Upload Section */}
          <div className="space-y-2">
            {!hasFiles ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-64"
              >
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <CloudUploadIcon className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Drag photos and videos here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  SVG, PNG, JPG or MP4 (max. 10MB)
                </p>
                <Button type="button" variant="soft" className="mt-4 cursor-pointer">
                  Select from computer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square group">
                    {selectedFiles[index]?.type.startsWith("video/") ? (
                      <video src={src} className="w-full h-full object-cover rounded-lg" controls={false} />
                    ) : (
                      <Image
                        src={src}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
                {selectedFiles.length < 10 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            {errors.files && (
              <p className="text-red-500 text-sm">{errors.files.message as string}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Caption & Details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
                <TextArea
                  size="3"
                  placeholder="Write a caption..."
                  className="w-full"
                  style={{ minHeight: '120px' }}
                  {...register("caption")}
                />
                {errors.caption && (
                  <p className="text-red-500 text-sm">{errors.caption.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <TextField.Root placeholder="Add location" {...register("location")}>
                  <TextField.Slot>
                    <MapPinIcon size={16} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tag People</label>
                <TextField.Root placeholder="Tag people (comma separated)" {...register("people")}>
                  <TextField.Slot>
                    <UsersIcon size={16} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.people && (
                  <p className="text-red-500 text-sm">{errors.people.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              size="3"
              disabled={isSubmitting || !hasFiles}
              className="w-full md:w-auto px-8"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Preloader /> Converting...
                </div>
              ) : (
                <>
                  <SendIcon size={16} />
                  Share Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedByAuth>
  );
}