import Container from '../components/container/Container.jsx';
import Home from '../views/home/Home.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndependentGroups from '../views/independent_groups/IndependentGroups.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Container>
          <Routes>
              <Route exact path="/" element={<Home />}/>
              <Route exact path="/groupes-autonomes" element={<IndependentGroups />}/>
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
