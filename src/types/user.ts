// types/user.ts
export type UserRole = "creator" | "consumer";
export type UserType =
    | "digital creator"
    | "musician"
    | "gamer"
    | "youtuber"
    | "member";

export type Gender = "male" | "female" | "other";

export interface User {
    id: number;
    name: string | null;
    username: string | null;
    email: string | null;

    avatar: string | null;

    role: UserRole;
    type: UserType;

    bio: string | null;
    dateOfBirth: string | null; // ISO string (frontend-safe)
    gender: Gender;
    phone: string | null;

    followersCount: number;
    followingCount: number;

    isVerified: boolean;
    isBlocked: boolean;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
