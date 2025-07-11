import express from 'express'
import { getCurrentUser, getprofile, search, updateprofile } from '../controllers/user.controllers.js'
import isAuth from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'

let userRouter = express.Router()

userRouter.get('/currentuser',isAuth,getCurrentUser)
userRouter.put('/updateprofile',isAuth,upload.fields([
    {name : "profileImage", maxCount : 1},
    {name : "coverImage", maxCount:1}
]),updateprofile)
userRouter.get('/profile/:userName',isAuth,getprofile)
userRouter.get('/search',isAuth,search)



export default userRouter