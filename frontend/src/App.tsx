import { Routes, Route } from 'react-router'
import { Home } from "./pages/Home"
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { About } from './pages/About'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/about' element={<About />}/>
      </Routes>
    </>
  )
}

export default App
