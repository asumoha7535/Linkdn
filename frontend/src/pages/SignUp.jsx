import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
function SignUp() {
    let [show, setShow]=  useState(false);
    let {serverUrl} = useContext(authDataContext)
    let {userData, setUserData} = useContext(userDataContext)
    let navigate = useNavigate()

    let [firstName, setFirstName] = useState("")
    let [lastName, setLastName] = useState("")
    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [err, setErr] = useState("");

   const handleSignUp = async (e) => {
  e.preventDefault();
  setErr("");
  try {
    let result = await axios.post(
      serverUrl + "/api/auth/signup",
      {
        firstName,
        lastName,
        userName,
        email,
        password
      },
      { withCredentials: true }
    );
    console.log(result);
    setUserData(result.data)
    navigate("/")
    setErr("")
    setFirstName("");
    setLastName("");
    setEmail("");
    setUserName("");
    setPassword("");
  } catch (error) {
    setErr(error.response?.data?.message || "Signup failed. Please try again.");
  }
};

  return (
    <>
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start'>
<div className='p-[30px] lg:p-[35px] w-full h-[120px] flex item-center'>
    <img src={logo} alt="" />
</div>

<form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px]' onSubmit={handleSignUp}>
<h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]' >Sign Up</h1>
<input type="text" placeholder='firstname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value ={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
<input type="text" placeholder='lastname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value ={lastName} onChange={(e)=>setLastName(e.target.value)}/>
<input type="text" placeholder='username' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'value ={userName} onChange={(e)=>setUserName(e.target.value)}/>
<input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md'value ={email} onChange={(e)=>setEmail(e.target.value)}/>
<div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
    <input type= {show ? 'text' : 'password'} placeholder='password' required className='w-full h-fullborder-none  text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md relative' value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <span className='absolute right-[20px] top-[10px] text-[#1dc9fd] cursor-pointer font-semibold' onClick={()=>setShow(prev=>!prev)}>
        {show ? 'hidden' : 'show'}
    </span>
</div>
{err && <p className='text-center text-red-500'>*{err}</p>}
<button className='w-[100%] h-[50px] rounded-full bg-[#2f9ed9] mt-[40px] text-white' >Sign Up</button>
<p className='text-center cursor-pointer' onClick={()=>navigate('/login')}>Already have an account ? <span className='text-[#1d64fd]' >Sign in</span></p>
</form>
    </div>
    </>
  )
}

export default SignUp