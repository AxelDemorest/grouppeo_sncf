import {MEETINGPOINT_ENDPOINT} from "../constants/apiConstants";
import apiCall from "../api";

const call = apiCall();

export const fetchMeetingPoints = async () => {
    const response = await call('GET', MEETINGPOINT_ENDPOINT);
    return response.data;
}
