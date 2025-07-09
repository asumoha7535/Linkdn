import React, { useContext, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import dp from '../assets/dp.webp'
import { FiPlus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineCameraAlt } from "react-icons/md";
import  { userDataContext } from '../context/UserContext';
import { BsImage } from "react-icons/bs";
import { HiPencil } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';

function Home() {
  let {userData, setUserData, edit, setEdit,postData, setPostData}= useContext(userDataContext)
let {serverUrl} = useContext(authDataContext)
  let [frontendImage,setFrontendImage] = useState("")
  let [backendImage,setBackendImage] = useState("")
  let [description,setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let image = useRef()
  let [posting,setPosting] = useState(false)

  function handleImage(e){
let file = e.target.files[0]
setBackendImage(file)
setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost (){
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if(backendImage){
        formdata.append("image",backendImage)
      }
      let result = await axios.post(serverUrl+"/api/post/create",formdata,{withCredentials : true})
      console.log(result);
      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)
      console.log(error);
      
    }
  }
  return (
  
   <div className='w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row'>
    {edit &&     <EditProfile />}
    <Navbar />
    <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative flex flex-col items-start'>
  <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden relative flex items-center justify-center cursor-pointer' onClick={()=>setEdit(true)}>
    <img src={userData.coverImage || ""} alt="" className='w-full h-full object-cover'/>
    <MdOutlineCameraAlt className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white cursor-pointer'/>
  </div>
  <div className='relative flex flex-col items-center w-full'>
    <div
      className='absolute left-1/2 -translate-x-1/2 -top-10 w-[70px] h-[70px] rounded-full overflow-hidden border-4 shadow-lg bg-white flex items-center justify-center'
      style={{ zIndex: 2 }}
      onClick={() => setEdit(true)}
    >
      <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
      <div className='absolute bottom-0 right-0 w-[22px] h-[22px] bg-[#17c1ff] rounded-full flex items-center justify-center border-2 border-white cursor-pointer'>
        <FiPlus className='text-white w-[14px] h-[14px]' />
      </div>
    </div>
    <div className='h-[35px]'></div>
  </div>

  <div className='mt-[10px] flex flex-col items-center w-full'>
    <div className='text-[20px] font-semibold text-gray-800'>{`${userData.firstName} ${userData.lastName}`}</div>
    {userData.headline && <div className='text-[16px] font-semibold text-gray-700'>{userData.headline}</div>}
    <div className='text-[15px] text-gray-500'>{userData.location}</div>
    <button className='w-[90%] h-[40px] mt-[30px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center' onClick={()=>setEdit(true)}>
      Edit Profile <HiPencil className='mx-2'/>
    </button>
  </div>


</div>

{uploadPost && <div className='w-full h-full bg-black fixed z-[100] top-0 left-0 opacity-[0.6]'>
   </div>}
   

{uploadPost && <div className='w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg rounded-lg fixed z-[200] p-[20px] flex items-start justify-start flex-col gap-[20px]'>
  <div
            className="absolute top-[20px] right-[20px] w-[25px] h-[25px] text-gray-800 font-bold cursor-pointer">
            <RxCross1 className="absolute top-[5px] right-[9px] w-[25px] h-[25px] text-gray-800 font-bold cursor-pointer" onClick={()=>setUploadPost(false)}/>
          </div>

          <div className='flex justify-start items-center gap-[10px]'>
    <div
      className='w-[70px] h-[70px] rounded-full overflow-hidden border-4 shadow-lg bg-white flex items-center justify-center' >
      <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
    </div>
        <div className='text-[20px] font-semibold text-gray-800'>{`${userData.firstName} ${userData.lastName}`}</div>
    </div>

    <textarea className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} outline-none border-none p-[10px] resize-none text-[19px]`} placeholder='what do you want to talk about...?' value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>

    
     <input type="file" ref={image} hidden onChange={handleImage} />
     <div className='w-full h-[300px] overflow-hidden flex items-center justify-center rounded-lg'>
      <img src={frontendImage || ""} alt="" className='h-full rounded-lg'/>
     </div>

    <div className='w-full h-[200px] flex flex-col '>
      <div className='p-[20px] flex items-center justify-start border-b-2'>
        <BsImage className='w-[24px] h-[24px] text-gray-500' onClick={()=>image.current.click()}/>
      </div>


      <div className='flex justify-end items-center'>
        <button className="w-[100px] h-[50px] rounded-full bg-[#2f9ed9] mt-[40px] text-white" disabled={posting} onClick={handleUploadPost}>
          {posting ? "posting..." : "Post"}
        </button>
      </div>
    </div>

</div>}


    <div className='w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] shadow-lg flex flex-col gap-[20px]'>
      <div className='w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center gap-[10px] p-[20px]'>
<div
      className='w-[70px] h-[70px] rounded-full overflow-hidden   shadow-lg bg-white flex items-center justify-center cursor-pointer' >
      <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
     
    </div>
    <button className='w-[80%] h-[60px] border-2 border-gray-500 rounded-full flex items-start justify-start px-[20px] pt-[15px] hover:bg-gray-400' onClick={()=>setUploadPost(true)}>Start a post</button>
      </div>
      {postData.map((post,index)=>(
      <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment } createdAt={post.createdAt}/>

      ))}
    </div>

    <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg'>
 
    </div>

  </div>
  
  )
}

export default Home