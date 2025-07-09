import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
export const signUp = async(req,res)=>{
    try{
        let {firstName, lastName,userName,email,password} = req.body
        let existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message : "email already exist !"})
        }
         let existUserName = await User.findOne({userName})
        if(existUserName){
            return res.status(400).json({message : "username already exist !"})
        }
        if(password.length<8){
            return Response.status(400).json({
                message : 'password atleast 8 letters'
            })
        }

        let hassedPassword= await bcrypt.hash(password,10)

        const user = await User.create({
            firstName,
             lastName,
             userName,
             email,
             password : hassedPassword
        })

        let token =await genToken(user._id)
        res.cookie("token", token,{
            httpOnly : true,
            maxAge :7*24*60*60*1000,
            sameSite :"strict",
            secure : process.env.NODE_ENVIRONMENT === "production"
        })

       return res.status(201).json(user)

    }catch(err){
 res.status(500).json({message : "signup error"});
console.log(err);

    }
}

//login

export const login = async(req,res)=>{
    try{
 let {email,password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "user does't exist exist !"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
       if(!isMatch){
        return res.status(400).json({
            massage :  'incorrect password'
        })
       }

        let token =await genToken(user._id)
        res.cookie("token", token,{
            httpOnly : true,
            maxAge :7*24*60*60*1000,
            sameSite :"strict",
            secure : process.env.NODE_ENVIRONMENT === "production"
        })

       return res.status(201).json(user)

    }catch(err){
 res.status(500).json({message : "login error"});
console.log(err);
    }
}

export const logOut=async(req,res)=>{
    try{
res.clearCookie("token");
return res.status(200).json({
    message : 'logout successfully'
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            message : 'logout error'
                })
        
    }
}