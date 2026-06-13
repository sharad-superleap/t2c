import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        files: 3
    }
});

export default upload;

// this stores the uploaded file in the memory and then sends directly to the cloudinary.