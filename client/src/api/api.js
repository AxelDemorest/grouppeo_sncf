import axios from 'axios';
import {handleApiError} from "./errors/apiErrorHandler";

function apiCall() {
    const token = localStorage.getItem('token');

    return async (method, endpoint, data = null, headers = null) => {
        const defaultHeaders = {};
        if (token) {
            defaultHeaders.Authorization = `Bearer ${token}`;
        }
        const mergedHeaders = {...defaultHeaders, ...headers};

        try {
            const response = await axios({
                method,
                url: `${import.meta.env.VITE_API_HOST}${endpoint}`,
                data,
                headers: mergedHeaders,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return handleApiError(error);
        }
    };
}

export default apiCall;
