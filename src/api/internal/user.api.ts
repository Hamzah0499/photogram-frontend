import { axiosTryCatch } from "@/utils/axiosTryCatch";
import axiosApi from "../axiosInstance";


export const register = async (data: any) => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post("/user/register", data);
    })
    return response;

};
export const loginWithGoogle = async (data: { code: string }) => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post("/user/auth/google", data);
    })
    return response;
}

export const login = async (data: any) => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post("/user/login", data);
    })

    return response;
}

export const logout = async () => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post("/user/logout");
    })
    return response;
}

export const refresh = async () => {
    const response = axiosTryCatch(async () => {
        return axiosApi.get("/user/refresh");
    }, { showToast: false })
    return response;
}

export const requestPasswordResetEmail = async (data: any) => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post("/user/request-reset-password-email", data);
    })
    return response;
}

export const resetPassword = async (token: string, data: any) => {
    const response = axiosTryCatch(async () => {
        return axiosApi.post(`/user/reset-password/${token}`, data);
    })
    return response;
}



// //*** OTP Verifications Apis
// export const enableOrDisableTwoFactorAuth = async (userId: number) => {
//     const response = axiosTryCatch(async () => {
//         return axiosApi.post(`/user/2fa/manage/${userId}`);
//     })
//     return response;
// }

// export const generateTwoFactorAuthOTP = async (userId: string) => {
//     const response = axiosTryCatch(async () => {
//         return axiosApi.post(`/user/2fa/generate/${userId}`);
//     })
//     return response;
// }

// export const verifyTwoFactorAuthOTP = async (userId: string, otp: string) => {
//     const response = axiosTryCatch(async () => {
//         return axiosApi.post(`/user/2fa/verify/${userId}`, { otp });
//     })
//     return response;
// }

// export const generateAccountVerificationOTP = async (userId: string) => {
//     const response = axiosTryCatch(async () => {
//         return axiosApi.post(`/user/account/generate/${userId}`);
//     })
//     return response;
// }

// export const verifyAccountVerificationOTP = async (userId: string, otp: string) => {
//     const response = axiosTryCatch(async () => {
//         return axiosApi.post(`/user/account/verify/${userId}`, { otp });
//     })
//     return response;
// }

// // *** Change Password Api's
// export const isRegisteredWithGoogle = async (userId: string) => {
//     const response = axiosTryCatch(async () => {
//         return await axiosApi.get(`/user/isRegisteredWithGoogle/${userId}`);
//     })
//     return response;
// }

// export const changeUserPassword = async (userId: string, data: any) => {
//     const response = axiosTryCatch(async () => {
//         return await axiosApi.put(`/user/change-password/${userId}`, data);
//     })
//     return response;
// }

// // *** User Address Api's ***
// export const uploadUserAvatar = async (userId: number, file: File) => {
//     const formData = new FormData();
//     formData.append("avatar", file);

//     // console.log("FormData: ", formData)
//     // for (const [key, value] of formData.entries()) {
//     //     console.log(key, value);
//     // }
//     // console.log("File: ", file)

//     const response = await axiosTryCatch(async () => {
//         return await axiosApi.post(
//             `/user/upload-avatar/${userId}`, formData
//         );
//     });

//     return response;
// };


// export const updateUserProfile = async (userId: number, data: any) => {
//     const response = axiosTryCatch(async () => {
//         return await axiosApi.patch(`/user/update/${userId}`, data);
//     })
//     return response;
// }

// // Api's for User Address Handling
// export const createUserAddress = async (data: any) => {
//     const response = axiosTryCatch(async () => {
//         return await axiosApi.post(`/user/address/create`, data);
//     })
//     return response;
// }

// export const updateUserAddress = async (recordId: number, data: any) => {
//     const response = axiosTryCatch(async () => {
//         return await axiosApi.put(`/user/address/update/${recordId}`, data);
//     })
//     return response;
// }

// // export const deleteUserAddress = async (userId: number, data: AddressFormInputs) => {
// //     const response = axiosTryCatch(async () => {
// //         return await axiosApi.delete(`/user/address/delete/${userId}`, data);
// //     })
// //     return response;
// // }


import { User } from "@/types/user";

export const getUserProfile = async (username: string) => {
    const response = axiosTryCatch<User>(async () => {
        return await axiosApi.get(`/user/username/${username}`);
    })
    return response;
}

export const searchUsers = async (query: string) => {
    return axiosTryCatch(async () => {
        return await axiosApi.get(`/user/search?query=${query}`);
    });
};

export const followUser = async (userId: number) => {
    return axiosTryCatch(async () => {
        return await axiosApi.post(`/user/follow/${userId}`);
    });
};

export const unfollowUser = async (userId: number) => {
    return axiosTryCatch(async () => {
        return await axiosApi.post(`/user/unfollow/${userId}`);
    });
};
