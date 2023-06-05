import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "../views/login/Login";
import RequireAuth from "../components/parents/requireAuth/RequireAuth";
import Home from "../views/home/Home";
import IndependentGroups from "../views/independent_groups/IndependentGroups";
import SupportedGroup from "../views/supportedGroup/SupportedGroup";
import UserAdmin from "../views/user_admin/UserAdmin";
import AgentAdmin from "../views/agent_admin/AgentAdmin";
import PlanningView from "../views/Planning/PlanningView/PlanningView";
import PlanningList from "../views/Planning/PlanningList/PlanningList";
import PlanningDetail from "../views/Planning/PlanningDetail/PlanningDetail";
import Settings from "../views/Settings/Settings";
import Supervision from "../views/Supervision/Supervision";
import PlanningCreate from "../views/Planning/PlanningCreate/PlanningCreate";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/connexion" element={<Login />}/>
                <Route exact path="/" element={
                    <RequireAuth>
                        <Home />
                    </RequireAuth>
                }/>
                <Route exact path="/groupes-autonomes" element={
                    <RequireAuth>
                        <IndependentGroups />
                    </RequireAuth>
                }/>
                <Route exact path="/groupes-pris-en-charge" element={
                    <RequireAuth>
                        <SupportedGroup />
                    </RequireAuth>
                }/>
                <Route exact path="/gestion-des-utilisateurs" element={
                    <RequireAuth>
                        <UserAdmin />
                    </RequireAuth>
                }/>
                <Route exact path="/gestion-des-agents" element={
                    <RequireAuth>
                        <AgentAdmin />
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
                <Route exact path="/planning-details/date/:planningDate" element={
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
                        <Supervision />
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