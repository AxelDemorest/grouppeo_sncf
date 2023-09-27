import apiCall from "../api";
import {PLANNING_ENDPOINT} from "../constants/apiConstants";

const call = apiCall();

export const fetchCountAgentsForPlanning = async (date) => {
    const response = await call('GET', `${PLANNING_ENDPOINT}/day/${date}/agents/count`);
    return response.data;
};
