import React, { useContext, useState, useEffect, createContext } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const userDataContext = createContext();

function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let { serverUrl } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData] = useState([]);
  let navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (err) {
      console.log(err);
      setUserData(null);
    }
  };

  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      console.log(result);
      setPostData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        serverUrl + `/user/user/profile/${userName}`,
        {
          withCredentials: true,
        }
      );
      setProfileData(result.data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);
  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData,
  };
  return (
    <>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </>
  );
}

export default UserContext;
