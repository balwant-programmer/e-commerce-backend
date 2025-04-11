import multer from "multer";

const storage = multer.memoryStorage();

export const uplaod = multer({ storage: storage });
