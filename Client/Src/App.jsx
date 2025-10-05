import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';


const App = () => {
  const { authUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  return (
    <div className='bg-[url(./assets/bgImage.svg)] bg-contain-x bg-cover bg-no-repeat'>
        <Toaster/>
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>
       
    </div>
  )
}

export default App