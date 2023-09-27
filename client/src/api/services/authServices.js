import {AUTH_ENDPOINT} from "../constants/apiConstants";
import apiCall from "../api";

const call = apiCall();

export const checkCredentials = async (values) => {
    const response = await call('POST', `${AUTH_ENDPOINT}/login`, values);
    if (response.success) {
        return response;
    } else {
        console.error(response.message);
    }
};
