import React, {useEffect} from "react";
import axios from "axios";

export function useGroupStatus(currentGroupId) {
    const [currentStatus, setCurrentStatus] = React.useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/group-status/${currentGroupId}/status`);
                setCurrentStatus(response.data);
            } catch (error) {
                console.error(error);
                setCurrentStatus([]);
            }
        };

        fetchStatus();
    }, [currentGroupId]);

    const updateStatus = (newStatus) => {
        setCurrentStatus((prevStatus) => [...prevStatus, newStatus]);
    };

    return { currentStatus, updateStatus };
}
