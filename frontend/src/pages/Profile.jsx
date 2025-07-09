import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import dp from "../assets/dp.webp";
import { FiPlus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineCameraAlt } from "react-icons/md";
import { userDataContext } from "../context/UserContext";
import { BsImage } from "react-icons/bs";
import { HiPencil } from "react-icons/hi2";
import EditProfile from "../components/EditProfile";
import Post from "../components/Post";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function Profile() {
  let { userData, setUserData, edit, setEdit, postData, setPostData } =
    useContext(userDataContext);
  let [profilePost, setProfilePost] = useState([]);
  let { serverUrl } = useContext(authDataContext);
  let [userConnection, setUserConnection] = useState([]);
  const handleGetUserConnecton = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection`, {
        withCredentials: true,
      });
      setUserConnection(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetUserConnecton();
  });

  useEffect(() => {
    setProfilePost(postData.filter((post) => post.author._id === userData._id));
  }, []);
  return (
    
    <>
      <div className=" bg-[#f0efe7] w-full min-h-[100vh] flex flex-col items-center pt-[100px] pb-[40px]">
        <Navbar />
        {edit && <EditProfile />}

        <div className="w-full max-w-[900px]  min-h-[100vh] flex flex-col gap-[10px]">
          <div className="relative bg-white pb-[40px] rounded shadow-lg">
            <div
              className="w-full h-[100px] bg-gray-400 rounded overflow-hidden relative flex items-center justify-center cursor-pointer"
              onClick={() => setEdit(true)}
            >
              <img
                src={userData.coverImage || ""}
                alt=""
                className="w-full h-full object-cover"
              />
              <MdOutlineCameraAlt className="absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            <div className="relative flex flex-col items-center w-full">
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-10 w-[70px] h-[70px] rounded-full overflow-hidden border-4 shadow-lg bg-white flex items-center justify-center"
                style={{ zIndex: 2 }}
                onClick={() => setEdit(true)}
              >
                <img
                  src={userData.profileImage || dp}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-[#17c1ff] rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                  <FiPlus className="text-white w-[14px] h-[14px]" />
                </div>
              </div>
              <div className="h-[35px]"></div>
            </div>

            <div className="mt-[10px] flex flex-col items-center w-full">
              <div className="text-[20px] font-semibold text-gray-800">{`${userData.firstName} ${userData.lastName}`}</div>
              {userData.headline && (
                <div className="text-[16px] font-semibold text-gray-700">
                  {userData.headline}
                </div>
              )}
              <div className="text-[15px] text-gray-500">
                {userData.location}
              </div>
              <div className="text-[15px] text-gray-500">{`${userConnection.length} connection`}</div>
              <button
                className="min-w-[150px] h-[40px] mt-[30px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center"
                onClick={() => setEdit(true)}
              >
                Edit Profile <HiPencil className="mx-2" />
              </button>
            </div>
          </div>

          <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg">
            {` Post (${postData.length})`}
          
          </div>

{userData.skills.length>0 &&  <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg"> <div className="text-black bold text-[20px]">
           Skills : 
 </div><br />
 {userData.skills.map((skill)=>(
  <div className="p-2">{skill}</div>
 ))}
 <button className="min-w-[150px] h-[40px] mt-[30px] my-[20px]  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center" onClick={()=>setEdit(true)}>Add Skills</button></div>}


 {userData.education.length>0 &&  <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg"> <div className="text-black bold text-[20px]">
          Education : 
 </div><br />
 {userData.education.map((edu)=>(
  <>
  <div className="p-2">Collage : {edu.collage}</div>
    <div className="p-2">Degree : {edu.degree}</div>
  <div className="p-2">Field of Study : {edu.fieldOfStudy}</div>
  </>
 ))}
 <button  className="min-w-[150px] h-[40px] mt-[30px] my-[20px] p-4  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center" onClick={()=>setEdit(true)}> Add Education</button>
</div>}

 {userData.experience.length>0 &&  <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg"> <div className="text-black bold text-[20px]">
          Experience : 
 </div><br />
 {userData.experience.map((exe)=>(
  <>
  <div className="p-2">Title : {exe.title}</div>
    <div className="p-2">Company : {exe.company}</div>
  <div className="p-2">Description : {exe.description}</div>
  </>
 ))}
 <button  className="min-w-[150px] h-[40px] mt-[30px] my-[20px] p-4  rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center" onClick={()=>setEdit(true)}> Add Experince</button>
</div>}
          
        </div>
      </div>
    </>
    
  );
}

export default Profile;
