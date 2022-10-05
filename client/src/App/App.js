import Container from '../components/container/Container.jsx';
import Home from '../views/home/Home.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Container>
          <Routes>
              <Route exact path="/" element={<Home />}/>
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
