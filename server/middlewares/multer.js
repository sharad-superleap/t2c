import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 6
    }
});

export default upload;

// this stores the uploaded file in the memory and then sends directly to the cloudinary.