import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'  

import Home from './pages/Home'
import Lobby from './pages/Lobby'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ProblemGenerate from "./pages/ProblemGenerate";
import ProblemView from "./pages/ProblemView";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/problem/generate" element={<ProblemGenerate />} />
        <Route path="/problem/:id" element={<ProblemView />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
