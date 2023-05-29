import axios, { AxiosRequestConfig } from "axios";
import { METHOD, ResponseType } from "../types";

async function requestWrap<T>(method: METHOD, url: string, data: Object | {}, options: AxiosRequestConfig<any>, addError: (data: ResponseType<any>) => void): Promise<ResponseType<T>> {
    let response: ResponseType<T> = {
        success: false,
        data: null,
        error: null,
        code: 404
    };
    let apiError: ResponseType<T> = {
        success: false,
        data: null,
        error: null,
        code: 404
    };
    try {

        if (method === 'GET') {
            response = await (
                await axios.get(url, options)
            ).data;
        }
        else if (method === 'POST') {
            response = await (
                await axios.post(url, data, options)
            ).data;
        }
    } catch (error: any) {
        if (error.code === axios.AxiosError.ERR_NETWORK) {
            apiError.code = 503;
            apiError.data = null;
            apiError.error = {
                message: 'Cannot connect to server!',
                statusCode: 503
            };
            apiError.success = false;
            return apiError;
        }
        if (axios.isAxiosError(error)) {
            apiError.code = error.response?.data.code;
            apiError.data = error.response?.data.data;
            apiError.error = error.response?.data.error;
            apiError.success = error.response?.data.success;
            return apiError;
        }
    }
    return response;
}
export default async function makeRequest<T>(method: METHOD, url: string, data: Object | {}, options: AxiosRequestConfig<any> = {}, addError: (data: ResponseType<any>) => void, setLoading: any): Promise<{ response: ResponseType<T>, displaySuccessMessage: () => void }> {
    setLoading(true);
    const response = await requestWrap<T>(method, url, data, options, addError);
    if (response) {
        if (!response.success) {
            addError(response);
        }
    }
    setLoading(false);
    const displaySuccessMessage = () => {
        if (response) {
            if (response.success) {
                addError(response)
            }
        }
    }
    return { response, displaySuccessMessage };
}