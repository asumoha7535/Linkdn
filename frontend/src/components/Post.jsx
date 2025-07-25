import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { io } from "socket.io-client";
import ConnectionButton from "./ConnectionButton";

let socket = io("http://localhost:8000");
function Post({ id, author, like, comment, description, image, createdAt }) {
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setLikes] = useState(like || []);
  let { userData, setUserData, getPost, handleGetProfile } = useContext(userDataContext);
  let [commentContent, setCommentContent] = useState("");
  let [comments, setComments] = useState(comment || []);
  let [showComment, setShowComment] = useState(false);

  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent },
        {
          withCredentials: true,
        }
      );
      setComments(result.data.comment);
      setCommentContent("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes);
      }
    });
    
    return () => {
      socket.off("likeUpdated");
    };
  }, [id]);

  useEffect(() => {}, [likes, setLikes, comments]);

  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg flex flex-col gap-[10px] shadow-lg p-[20px]">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-start gap-[10px]" onClick={()=>handleGetProfile(author.userName)}>
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden   shadow-lg bg-white flex items-center justify-center cursor-pointer">
            <img
              src={author.profileImage || dp}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="text-[22px] font-semibold">{`${author.firstName} ${author.lastName}`}</div>
            <div className="text-[16px] ">{`${author.headline}`}</div>
            <div className="text-[16px] ">{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        <div>
          {userData._id!=author._id && <ConnectionButton userId = {author._id}/>}
        </div>

      </div>
      <div
        className={`w-full ${
          more ? "max-h-[100px] overflow-hidden" : ""
        } pl-[50px]`}
      >
        {description}
      </div>
      <div
        className="pl-[50px] text-19px font-bold cursor-pointer"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less..." : "read more..."}
      </div>
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}

      <div>
        <div className="w-full flex justify-between items-center p-[20px]  border-b-2 border-gray-500">
          <div className="flex items-center justify-center gap-[5px] text-[18px] ">
            <BiLike className="text-[#1ebbff] w-[20px] h-[20px]" />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <span>{comment.length}</span>
            <span>comment</span>
          </div>
        </div>

        <div className="flex justify-start items-center w-full p-[20px] gap-[20px]">
          {!likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiLike className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          )}
          {likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff]" />
              <span className="text-[#07a4ff]">Liked</span>
            </div>
          )}

          <div
            className="flex justify-center items-center gap-[5px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots />
            <span>Comment</span>
          </div>
        </div>
        {showComment && (
          <div>
            <form
              className="border-b-2 border-b-gray-300 p-[10px]"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder={"leave a comment"}
                className="outline-none border-none"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button>
                <LuSendHorizontal className=" text-[#07a4ff] w-[22px] h-[22px]" />
              </button>
            </form>
            <div className="flex flex-col gap-[20px]">
              {comments.map((com, idx) => (
                <div
                  key={com._id || idx}
                  className="flex flex-col gap-[20px] p-[20px] border-b-2 border-b-gray-300"
                >
                  <div className="w-full flex justify-start items-center">
                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center cursor-pointer">
                      <img
                        src={com.user?.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="pl-[12px]">
                      <div className="text-[16px] font-semibold">
                        {`${com.user?.firstName || ""} ${com.user?.lastName || ""}`}
                      </div>
                      <div className="text-[13px]">
                        {moment(com.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>
                  <div className="pl-[30px] g-[10px]">{com.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
