import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
    console.log("multer", file);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// save the file with unique name so that if a file with same name comes into our server we don't overwrite it..

export const upload = multer({ storage });
