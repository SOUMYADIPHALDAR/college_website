import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

const uploadToCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath, 
            { resource_type: "auto"}
        );
        return response;
    } catch (error) {
        console.log("Failed to upload at cloudinary..", error.message);
        throw error;
    } finally {
        fs.unlinkSync(localFilePath) && fs.existsSync(localFilePath);
    }
}

export default uploadToCloudinary;