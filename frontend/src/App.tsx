import { Routes, Route } from 'react-router'
import { Home } from "./pages/Home"
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { About } from './pages/About'
import { VolumeContent } from './pages/VolumeContent'
import { ChapterChallenge } from './pages/ChapterChallenge'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './shared/components/ProtectedRoute'
import { NotFound } from './shared/components/NotFound'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/about' element={<About />}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/volumeContent' element={<VolumeContent />}/>
          <Route path='/chapterChallenge' element={<ChapterChallenge />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </>
  )
}

export default App
