import { HashRouter, Route, Routes, Link } from 'react-router'
import './App.css'
import Home from './components/Home'
import AboutMe from './components/AboutMe'

function App() {
  return <HashRouter>
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About Me</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/about" element={<AboutMe/>}></Route>
    </Routes>
  </HashRouter>
  
}

export default App
