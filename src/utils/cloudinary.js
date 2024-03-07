import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const respose = await cloudinary.uploader.upload(localFilePath, {
      resource_type: auto,
    });
    // file has been uploaded successfully
    console.log("file is uploaded successfully", response);
    console.log(response.url);
    return response;
  } catch (error) {
    // remove the temp local file as the upload failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
