import apiCall from "../api";
import {RADIO_ENDPOINT} from "../constants/apiConstants";

const call = apiCall();

export const fetchRadios = async () => {
    const response = await call('GET', RADIO_ENDPOINT);
    return response.data;
}

export const createRadio = async (radio) => {
    const response = await call('POST', RADIO_ENDPOINT, radio);
    return response.data;
}
