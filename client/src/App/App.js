import Home from '../views/home/Home.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndependentGroups from '../views/independent_groups/IndependentGroups.jsx';
import Login from '../views/login/Login.jsx';
import RequireAuth from '../components/requireAuth/RequireAuth.jsx';
import './App.less';
import SupportedGroup from '../views/supportedGroup/SupportedGroup.jsx';
import UserAdmin from '../views/user_admin/UserAdmin.jsx';

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
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
