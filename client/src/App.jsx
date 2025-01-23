import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import { useContext } from 'react'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJob from './pages/ManageJob'
import ViewApplication from './pages/ViewApplication'
import 'quill/dist/quill.snow.css'
const App = () => {
  const {showRecruiterLogin}= useContext(AppContext)
  return (
    <div>
     
    { showRecruiterLogin && <RecruiterLogin/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/apply-job/:id' element={<ApplyJob/>}/>
        <Route path='/applications' element={<Application/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>

          <Route path='add-job' element={<AddJob/>} />
          <Route path='manage-jobs' element={<ManageJob/>} />
          <Route path='view-applications' element={<ViewApplication/>} />
        
        </Route>
      </Routes>
    </div>
  )
}

export default App
