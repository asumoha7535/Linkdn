import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const uploadOnClodinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!filePath || !fs.existsSync(filePath)) return null; 
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); 
        return uploadResult.secure_url;
    } catch (err) {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.log(err);
        throw err;
    }
}
export default uploadOnClodinary;