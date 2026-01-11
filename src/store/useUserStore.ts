// stores/useUserStore.ts
"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // actions
    setUser: (user: User | null) => void;
    updateUser: (data: Partial<User>) => void;

    updateFollowersCount: (delta: number) => void;
    updateFollowingCount: (delta: number) => void;

    clearUser: () => void;
    setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,
                isLoading: false,

                setUser: (user) =>
                    set({
                        user,
                        isAuthenticated: !!user,
                        isLoading: false,
                    }),

                updateUser: (data) =>
                    set((state) => ({
                        user: state.user ? { ...state.user, ...data } : null,
                    })),

                /** FOLLOWERS */
                updateFollowersCount: (delta) =>
                    set((state) => ({
                        user: state.user
                            ? {
                                ...state.user,
                                followersCount: Math.max(
                                    0,
                                    state.user.followersCount + delta
                                ),
                            }
                            : null,
                    })),

                /** FOLLOWING */
                updateFollowingCount: (delta) =>
                    set((state) => ({
                        user: state.user
                            ? {
                                ...state.user,
                                followingCount: Math.max(
                                    0,
                                    state.user.followingCount + delta
                                ),
                            }
                            : null,
                    })),

                clearUser: () =>
                    set({
                        user: null,
                        isAuthenticated: false,
                    }),

                setLoading: (loading) =>
                    set({
                        isLoading: loading,
                    }),
            }),
            {
                name: "user-store",
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        )
    )
);
