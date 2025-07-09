import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import dp from "../assets/dp.webp";
function Network() {
  let { serverUrl } = useContext(authDataContext);
  let [connections, setConnections] = useState([]);
  const handleGetRequest = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true,
      });
      setConnections(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConnection = async (requestId) => {
try {
  let result  = await  axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, {
    withCredentials: true})
    setConnections(connections.filter((con)=>con._id==requestId))
} catch (error) {
  console.log(error);
  
}
  }

  const handleRejectConnection = async (requestId) => {
try {
  let result  = await  axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, {
    withCredentials: true})
        setConnections(connections.filter((con)=>con._id==requestId))
} catch (error) {
  console.log(error);
  
}
  }
  useEffect(() => {
    handleGetRequest();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px]">
        <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600">
          Invitations {connections.length}
        </div>
       {connections.length > 0 &&  <div className="w-full max-w-[60%] shadow-lg flex flex-col gap-[20px] min-h-[100px] items-center justify-center">
          {connections.map((connection, index) => (
            <div className="w-full min-h-[100px] p-[20px] flex justify-between  items-center">
              <div className="flex justify-center items-center gap-[10px]">
<div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer'>
    <img src={connection.sender.profileImage || dp} alt="" className='w-full h-full' />
  </div>
       <div className="mx-[10px]">
  <div className='text-[19px] font-semibold text-gray-700'>{`${connection.sender.firstName} ${connection.sender.lastName}`}</div>
              </div>
              </div>

              <div className="flex justify-center items-center gap-[10px]">
                <button className="text-[#18c5ff] font-semibold" onClick={()=>handleAcceptConnection(connection._id)}><FaRegCheckCircle className="w-[40px] h-[40px]"/></button>
                <button className="text-[#ff4218] font-semibold" onClick={()=>handleRejectConnection(connection._id)}><RxCrossCircled  className="w-[40px] h-[40px]"/></button>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </>
  );
}

export default Network;
