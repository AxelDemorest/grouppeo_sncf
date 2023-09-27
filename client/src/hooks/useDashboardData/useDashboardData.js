import React, {useEffect, useState} from "react";
import axios from "axios";
import {dateFormatter} from "../../utils/date";
import {fetchGroupCountForGivenDay, fetchGroupsCountForNext5Days} from "../../api/services/groupServices";
import {fetchUsersCountForNext5Days} from "../../api/services/userServices";
import {fetchCountAgentsForPlanning} from "../../api/services/planningService";
import {fetchTrainsForGivenDay} from "../../api/services/trainServices";

export function useDashboardData() {
    const [statistics, setStatistics] = useState({
        groupsData: [],
        usersData: [],
        groupCount: 0,
        autonomousGroupCount: 0,
        agentCount: 0,
        trainCount: 0
    });

    const date = dateFormatter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    fetchGroupsCountForNext5Days(),
                    fetchUsersCountForNext5Days(),
                    fetchGroupCountForGivenDay(date),
                    fetchGroupCountForGivenDay(date, false),
                    fetchCountAgentsForPlanning(date),
                    fetchTrainsForGivenDay(date)
                ]);

                setStatistics({
                    groupsData: responses[0].data,
                    usersData: responses[1].data,
                    groupCount: responses[2].data,
                    autonomousGroupCount: responses[3].data,
                    agentCount: responses[4].data,
                    trainCount: responses[5].data.length
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    return statistics;
}
