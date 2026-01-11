import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_FILES = 10;

export const createPostSchema = z.object({
    caption: z.string().max(500, "Caption must be less than 500 characters").optional(),
    location: z.string().max(200, "Location must be less than 200 characters").optional(),
    people: z.string().max(255, "People list must be less than 255 characters").optional(),
    files: z
        .custom<FileList>()
        .refine((files) => files?.length > 0, "At least one file is required.")
        .refine((files) => files?.length <= MAX_FILES, `You can upload up to ${MAX_FILES} files only.`)
        .refine(
            (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            `Each file must be less than 10MB.`
        )
        .refine(
            (files) =>
                Array.from(files).every(
                    (file) =>
                        ACCEPTED_IMAGE_TYPES.includes(file.type) || ACCEPTED_VIDEO_TYPES.includes(file.type)
                ),
            "Only .jpg, .jpeg, .png, .webp, .mp4, and .webm formats are supported."
        ),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
