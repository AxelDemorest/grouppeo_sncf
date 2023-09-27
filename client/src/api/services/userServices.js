import {PLANNING_ENDPOINT, USER_ENDPOINT} from "../constants/apiConstants";
import apiCall from "../api";

const call = apiCall();

// path : /api/planning/day/{planningDate}/agent-number/{agentNumber}
export const fetchUserDetails = async (planningDate, userId) => {
    const response = await call('GET', `${PLANNING_ENDPOINT}/day/${planningDate}/agent-number/${userId}`);
    return response.data;
}

// path : /api/user/agents
export const fetchUsersByType = async () => {
    const response = await call('GET', `${USER_ENDPOINT}/agents`);
    return response.data;
}

export const fetchUsersCountForNext5Days = async () => {
    const response =  await call('GET', `${USER_ENDPOINT}/list/counts`);
    return response.data;
}

// path : /api/user/{userId}/change-password
export const changePassword = async (userId, password) => {
    return await call('POST', `${USER_ENDPOINT}/${userId}/change-password`, password);
};
