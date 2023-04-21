import Home from '../views/home/Home.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndependentGroups from '../views/independent_groups/IndependentGroups.jsx';
import Login from '../views/login/Login.jsx';
import RequireAuth from '../components/parents/requireAuth/RequireAuth.jsx';
import './App.less';
import SupportedGroup from '../views/supportedGroup/SupportedGroup.jsx';
import UserAdmin from '../views/user_admin/UserAdmin.jsx';
import AgentAdmin from '../views/agent_admin/AgentAdmin.jsx';
import PlanningView from "../views/Planning/PlanningView/PlanningView";
import PlanningList from "../views/Planning/PlanningList/PlanningList";
import PlanningDetail from "../views/Planning/PlanningDetail/PlanningDetail";
import Settings from "../views/Settings/Settings";
import Supervision from "../views/Supervision/Supervision";
import PlanningCreate from "../views/Planning/PlanningCreate/PlanningCreate";

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
