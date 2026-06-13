import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARYCLOUDNAME,
    api_key: process.env.CLOUDINARYAPIKEY,
    api_secret: process.env.CLOUDINARYAPISECRET
});

export const uploadToCloudinary = async (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {folder},
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        .end(fileBuffer);
    })
}

export default cloudinary;