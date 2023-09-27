import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "../views/authentication/login/Login";
import RequireAuth from "../components/parents/requireAuth/RequireAuth";
import Dashboard from "../views/dashboard/Dashboard";
import AutonomousGroups from "../views/groups/autonomousGroups/AutonomousGroups";
import SupportGroups from "../views/groups/supportGroups/SupportGroups";
import Users from "../views/management/users/Users";
import Agents from "../views/management/agents/Agents";
import PlanningView from "../views/planning/planningView/PlanningView";
import PlanningList from "../views/planning/planningList/PlanningList";
import PlanningDetail from "../views/planning/planningDetail/PlanningDetail";
import Settings from "../views/settings/Settings";
import Supervision from "../views/supervision/Supervision";
import PlanningCreate from "../views/planning/planningCreate/PlanningCreate";
import ResetPassword from "../views/authentication/resetPassword/ResetPassword";
import SupervisionV2 from "../views/supervision/supervisionV2/SupervisionV2";
import SupervisionV3 from "../views/supervision/supervisionV3/SupervisionV3";
import Radios from "../views/radios/Radios";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/connexion" element={<Login />}/>
                <Route exact path="/change-password" element={<ResetPassword />}/>
                <Route exact path="/" element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }/>
                <Route exact path="/groupes-autonomes" element={
                    <RequireAuth>
                        <AutonomousGroups />
                    </RequireAuth>
                }/>
                <Route exact path="/groupes-pris-en-charge" element={
                    <RequireAuth>
                        <SupportGroups />
                    </RequireAuth>
                }/>
                <Route exact path="/gestion-des-utilisateurs" element={
                    <RequireAuth>
                        <Users />
                    </RequireAuth>
                }/>
                <Route exact path="/gestion-des-agents" element={
                    <RequireAuth>
                        <Agents />
                    </RequireAuth>
                }/>
                <Route exact path="/gestion-des-radios" element={
                    <RequireAuth>
                        <Radios />
                    </RequireAuth>
                }/>
                <Route exact path="/planning" element={
                    <RequireAuth>
                        <PlanningView />
                    </RequireAuth>
                }/>
                <Route exact path="/liste-des-plannings" element={
                    <RequireAuth>
                        <PlanningList />
                    </RequireAuth>
                }/>
                <Route exact path="/date/:planningDate/planning" element={
                    <RequireAuth>
                        <PlanningDetail />
                    </RequireAuth>
                }/>
                <Route exact path="/settings" element={
                    <RequireAuth>
                        <Settings />
                    </RequireAuth>
                }/>
                <Route exact path="/supervision" element={
                    <RequireAuth>
                        <SupervisionV3 />
                    </RequireAuth>
                }/>
                <Route exact path="/creation-planning" element={
                    <RequireAuth>
                        <PlanningCreate />
                    </RequireAuth>
                }/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
