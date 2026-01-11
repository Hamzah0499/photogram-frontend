import toast from "react-hot-toast";
import { ZodSchema } from "zod/v4";
import { axiosResponseSchema, AxiosResponseType } from "../types/AxiosResponse";
import { AxiosError, HttpStatusCode } from "axios";

type TryCatchOptionsType = { showToast?: Boolean };

export const axiosTryCatch = async <TDataType>(
    callback: CallableFunction,
    // responseSchema?: ZodSchema,
    options: TryCatchOptionsType = { showToast: true },
): Promise<TDataType> => {
    try {
        const response = (await callback());
        return response;
    } catch (_error) {
        let errorMessage = '';
        if (_error instanceof AxiosError) {
            const { response } = _error as AxiosError<AxiosResponseType>;
            if (!response) {
                errorMessage = 'Oops! Server not responding. Server is not running or is temporarily down.';
            } else {
                const { data, error } = axiosResponseSchema.safeParse(response.data);
                if (error) {
                    errorMessage = 'Oops! Invalid Response came. Unexpected response came from server.';
                } else {
                    if (response.status === HttpStatusCode.Unauthorized) {
                        errorMessage =
                            data.error.message ||
                            'Oops! You are not authenticated for this request. Please login again, to continue using application.';
                    } else if (response.status === HttpStatusCode.NotFound && Object.keys(data).length === 0) {
                        errorMessage =
                            'Oops! Invalid Request URL. The resource you are expecting is temporarily disabled or moved permanently.';
                    } else {
                        errorMessage =
                            data.error.message || 'Oops! Something went wrong. Please check the logs or try again later.';
                    }
                }
            }
        } else if (_error instanceof Error) {
            errorMessage = _error.message;
        } else if (_error instanceof TypeError) {
            errorMessage = _error.message;
        }

        if (options?.showToast) toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};
