import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid"

// Configure storage (optional: files are deleted after Cloudinary upload)
const storage = multer.diskStorage({
    destination: "src/uploads/",
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${uuidv4()}.png`);
    },
});

// File filter for image uploads
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
