import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo2 from '../assets/logo2.png'
import { IoSearchSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import dp from '../assets/dp.webp';
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';

function Navbar() {
  let [activeSearch, setActiveSearch] = useState(false)
  let {userData, setUserData} = useContext(userDataContext)
  let navigate = useNavigate();
  let [showPopUp, setShowPopUp] = useState(false)
let {serverUrl} = useContext(authDataContext)
let [searchInput, setSearchInput] = useState("")
let [searchData, setSearchData] = useState([])

const handleSignOut = async()=>{
  try {
let result = await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true }); 
setUserData(null)
    navigate("/login")
   console.log(result);
  } catch (error) {
    console.log(error);
    
  }
}

const handleSearch = async()=>{
try {
  let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials : true})
  
  setSearchData(result.data)
} catch (error) {
  setSearchData([]);
  console.log(error);
  
}
}
useEffect(()=>{
  if(searchInput){
    handleSearch()
  }
},[searchInput])

  return (
   <>
   <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
    <div className='flex justify-center items-center gap-[10px] '>
<div onClick={()=>{
  activeSearch(false),
navigate("/")
}}>
      <img src={logo2} alt="" className='w-[50px]'/>
</div>
{!activeSearch && <div><IoSearchSharp className='w-[25px] h-[23px] text-gray-600 lg:hidden' onClick={()=>setActiveSearch(true)}/></div>}
<div><IoSearchSharp className='w-[25px] h-[23px] text-gray-600 lg:hidden' onClick={()=>setActiveSearch(true)}/></div>

{searchData.length>0 && <div className='absolute top-[80px] lg:left-[20px] left-[0px]  w-[100%] lg:w-[700px] shadow-lg bg-white min-h-[100px] flex flex-col gap-[20px] p-[20px]'>
{searchData.map((sea)=>(
  <div className='flex gap-[20px] items-center border-b-gray-300 p-[10px]'>
    <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
    <img src={sea.profileImage || dp} alt="" className='w-full h-full' />
  </div>
  <div>
    <div className='text-[19px] font-semibold text-gray-700'>{`${sea.firstName} ${sea.lastName}`}</div>
        <div className='text-[15px] font-semibold text-gray-700'>{sea.headline}</div>
</div>
  </div>
))}
</div>}



<form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${activeSearch ? "hidden" : "flex"}`} >
<div><IoSearchSharp className='w-[25px] h-[23px] text-gray-600'/></div>
<input type="text" value ={searchInput} className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search users...' onChange={(e)=>setSearchInput(e.target.value)}/>
</form>
</div>

<div className='flex justify-center items-center gap-[20px] relative'>
{showPopUp &&  <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] g-[20px]'>
<div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
    <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
  </div>
  <div className='text-[19px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>
  <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>navigate("/profile")}>View Profile</button>
  <div className='w-full h-[1px] bg-gray-700 mt-3'></div>
  <div className='flex  items-center w-full justify-start text-gray-600 g-[10px] cursor-pointer'onClick={()=>navigate("/network")}>
    <FaUserGroup className='w-[23px] h-[23px] text-gray-600'/>
  <div>My Networks</div>
  </div>
    <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] mt-2' onClick={handleSignOut}>Sign Out</button>

  </div>}
  

  <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer'>
    <IoMdHome className='w-[23px] h-[23px] text-gray-600'/>
  <div>Home</div>
  </div>

  <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={()=>navigate("/network")}>
    <FaUserGroup className='w-[23px] h-[23px] text-gray-600'/>
  <div>My Networks</div>
  </div>

  <div className='flex flex-col items-center justify-center text-gray-600 cusor-pointer ' onClick={()=>navigate("/notifications")}>
    <IoMdNotifications className='w-[23px] h-[23px] text-gray-600'/>
  <div className='hidden md:block'>Notification</div>
  </div>

  <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={()=>setShowPopUp(prev=>!prev)}>
    <img src={userData.profileImage || dp} alt="" className='w-full h-full' />
  </div>
</div>
   </div>
   </>
  )
}

export default Navbar