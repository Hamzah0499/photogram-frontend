import { refresh } from "@/api/internal/user.api";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

function useAutoLogin() {
    const [loading, setLoading] = useState(true);
    const { setUser, clearUser } = useUserStore();
    useEffect(() => {
        (async function autologinapicall() {
            try {
                //call api
                const response: any = (await refresh());
                // if response good refresh user data
                if (response?.data?.isSuccess && response?.data?.data) {
                    console.log("User found: ", response.data.data)
                    setUser(response.data.data);
                } else {
                    clearUser();
                }
            } catch (error) {
                console.log("Auto-login: No active session found.");
                clearUser();
            } finally {
                setLoading(false);
            }
        })();
    }, [setUser, clearUser]);
    return loading;
}

export default useAutoLogin;
