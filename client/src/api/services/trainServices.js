import {TRAIN_ENDPOINT} from "../constants/apiConstants";
import apiCall from "../api";

const call = apiCall();

export const fetchTrainByNumber = async (trainNumber, date) => {
    const response = await call('GET', `${TRAIN_ENDPOINT}/${trainNumber}/day/${date}`);
    return response.data;
};

export const fetchTrainsForGivenDay = async (date) => {
    const response = await call('GET', `${TRAIN_ENDPOINT}/${date}`);
    return response.data;
};
