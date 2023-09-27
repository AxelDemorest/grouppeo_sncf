import { GROUP_ENDPOINT } from "../constants/apiConstants";
import apiCall from "../api";

const call = apiCall();

export const fetchUserGroups = async (planningDate, userId) => {
    const response = await call('GET', `${GROUP_ENDPOINT}/planning/day/${planningDate}/agent/${userId}`);
    return response.data;
}

export const fetchPointGroups = async (planningDate, groupMeetingPoint) => {
    const response = await call('GET', `${GROUP_ENDPOINT}/day/${planningDate}/group-meeting-point/${groupMeetingPoint}`);
    return response.data;
}

export const fetchIsolatedGroups = async (planningDate) => {
    const response = await call('GET', `${GROUP_ENDPOINT}/day/${planningDate}/isolated-groups`);
    return response.data;
}

export const fetchGroupsCountForNext5Days = async () => {
    const response = await call('GET', `${GROUP_ENDPOINT}/list/counts`);
    return response.data;
}

export const fetchGroupCountForGivenDay = async (date, supported = true) => {
    const response = await call('GET', `${GROUP_ENDPOINT}/date/${date}${supported ? '?supported=true' : ''}`);
    return response.data;
}

export const createGroup = async (group) => {
    const response = await call('POST', `${GROUP_ENDPOINT}/`, group);
    return response.data;
}
