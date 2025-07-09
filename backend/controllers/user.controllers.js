import User from "../models/user.model.js"
import upload from "../middlewares/multer.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { json } from "express"

export const getCurrentUser = async(req,res)=>{
    try{
        let id = req.userId
        const user = await User.findById(id).select("-password")
        if(!user){
            return res.status(400).json({ message :"user does not found"})
        }
        return res.status(200).json(user)

    }catch(error){
        console.log(error);
        
return res.status(400).json({message : "get curent user error"})
    }
}

export const updateprofile = async(req,res)=>{
try {
    let {firstName, lastName, userName, headline, location, gender} = req.body
    let skills = req.body.skills ? JSON.parse(req.body.skills) : []
        let education = req.body.education ? JSON.parse(req.body.education) : []
    let experience = req.body.experience ? JSON.parse(req.body.experience) : []

    let profileImage;
    let coverImage
    console.log(req.files);
    
    if(req.files.profileImage){
      profileImage =await uploadOnCloudinary(req.files.profileImage[0].path)
    }
       if(req.files.coverImage){
     coverImage =await uploadOnCloudinary(req.files.coverImage[0].path)
    }
    let user = await User.findByIdAndUpdate(req.userId,{
        firstName, lastName, userName, headline, location, gender, skills, education, experience,profileImage,coverImage
    },{new :true}).select("-password")
    return res.status(200).json(user)
} catch (error) {
    console.log(error);
    res.status(500).json({
message :"update profile"
    })
    
}
}

export const getprofile = async(req,res)=>{
    try {
        let {uerName}=  req.params
        let user = await User.findOne({userName}).select("-password")
        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "get profile error"})
        
    }
}

export const search = async (req,res)=>{
    try {
        let {query} = req.query
        if(!query){
            return res.status(400).json({message : "query is required"})
        }
        let users= await User.find({
            $or:[
                {firstName : {$regex:query,$options:"i"}},
                {lastName : {$regex:query,$options:"i"}},
                {userName : {$regex:query,$options:"i"}},
                {skills : {$in:[query]}}

            ]
        })
        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : `search error ${error}`})
        
    }
}