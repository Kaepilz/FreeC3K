import React, { useState, useContext } from 'react'
import assets from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {

  const [currState,setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")

  const {login} = useContext(AuthContext);
  
  const onSubmitHandler = (event)=>{
    event.preventDefault();

    login(currState=== "Sign up" ? 'signup' : 'login', {
      fullName,
      email,
      password,
      bio
    })
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
         {/* left */}
         <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />

         {/* right */}
    <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
    <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}</h2>

    {currState === "Sign up" && (
      <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Full Name"></input>
    )}
    <>
        <input onChange={(e)=>setEmail(e.target.value)} value={email}  type="email" placeholder="Email Adress" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"></input>

        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"></input>
    </>
     
      {currState === "Sign up" && (
        <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder="Bio"></textarea>
      )}

      <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
        {currState === 'Sign up' ? 'Create Account' : 'Login Now'}
      </button>

      <div className= 'flex items-center gap-2 text-sm text-gray-500'>
        <input type='checkbox' ></input>
        <p>Agree to the terms of use and privacy policy.</p>
      </div>
    <div className='flex flex-col gap-2'>
     {currState === 'Sign up' ? (
      <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrState("Login")}}className='font-medium cursor-pointer text-violet-500'>Login here</span></p>
      ):(
      <p className='text-sm text-gray-600'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-medium cursor-pointer text-violet-500'>Click here</span></p>
      )}
    </div>
    </form>
    </div>
  )
}

export default LoginPage