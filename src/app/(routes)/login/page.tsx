"use client";

import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginSchema, LoginInput } from "@/lib/validators/auth.schema";
import { login } from "@/api/internal/user.api";
import { useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import ProtectedByAuth from "@/components/ProtectedByAuth";


const LoginPage = () => {
    const router = useRouter();
    const { setUser } = useUserStore();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        try {
            const response: any = await login(data);

            console.log("Response: ", response)

            if (response.data.isSuccess) {
                setUser(response.data.data)
                toast.success("Logged in successfully");
                router.push("/");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            // Error is handled by axiosTryCatch, but we catch it here to stop execution flow
            console.error(error);
        }
    };

    return (
        <ProtectedByAuth redirectIfAuthenticated={true}>
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-full max-w-[935px] px-4 flex items-center justify-center gap-12">

                    {/* Phone Preview (Desktop only) */}
                    <section className="hidden lg:flex flex-1 justify-end">
                        <div className="relative w-full max-w-[480px] aspect-[3/6]">
                            <Image
                                src="/landing-2x.png"
                                alt="Instagram landing "
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </section>

                    {/* Auth Section */}
                    <section className="flex-1 max-w-[350px] w-full space-y-3">
                        {/* Login box */}
                        <div className="bg-white border border-gray-200 px-10 py-8 text-center">
                            <div className="w-full flex flex-col items-center justify-center gap-2">
                                <Image src={"/insta.png"} width={50} height={50} alt="Photogram" />
                                <h1 className="instagram-gradient text-2xl font-bold mb-8">
                                    <span>Photogram By Hamzah</span>
                                </h1>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        {...register("email")}
                                        className={`w-full text-sm px-3 py-2 border rounded-sm bg-gray-50 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-gray-400'}`}
                                        aria-invalid={errors.email ? "true" : "false"}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 text-left mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        {...register("password")}
                                        className={`w-full text-sm px-3 py-2 border rounded-sm bg-gray-50 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-gray-400'}`}
                                        aria-invalid={errors.password ? "true" : "false"}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-red-500 text-left mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-2 py-1.5 rounded-md text-sm font-semibold text-white bg-[#4cb5f9] hover:bg-[#409ee6] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Logging in..." : "Log in"}
                                </button>
                            </form>

                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-300" />
                                <span className="mx-4 text-xs font-semibold text-gray-400">
                                    OR
                                </span>
                                <div className="flex-grow border-t border-gray-300" />
                            </div>


                            <Link
                                href="#"
                                className="block mt-4 text-xs text-[#00376b]"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign up */}
                        <div className="bg-white border border-gray-200 py-4 text-center text-sm">
                            <span className="text-gray-700">
                                Don&apos;t have an account?{" "}
                            </span>
                            {/* <a href="#" className="font-semibold text-[#0095f6]"> */}
                            {/* </a> */}
                            <span className="font-bold">

                                Sign up
                            </span>
                        </div>

                    </section>
                </div>
            </main>

            {/* Global styles */}
            <style jsx global>{`
        .instagram-gradient {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeInOut 15s infinite;
        }

        .animate-fadeIn:nth-child(2) {
          animation-delay: 5s;
        }

        .animate-fadeIn:nth-child(3) {
          animation-delay: 10s;
        }
      `}</style>
        </ProtectedByAuth>
    );
};

export default LoginPage;
