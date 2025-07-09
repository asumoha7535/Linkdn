import mongoose from "mongoose";

const connectDb = async()=>{
    try{
mongoose.connect(process.env.URI)
console.log("db connected");

    }catch(err){
console.log("db error");

    }
}

export default connectDb