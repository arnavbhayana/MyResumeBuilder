import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/Home/Dashboard'
import EditResume from './pages/ResumeUpdate/EditResume'
import UserProvider from './context/userContext'

export default function App() {
  return (
    <UserProvider>
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/resume/:resumeId" element={<EditResume />} />

      </Routes>
    </Router>
    </div>
    <Toaster 
    toastOptions={{
      className:"",
      style:{
        fontSize:"13px"
      }
    }}/>
    </UserProvider>
  )
}
