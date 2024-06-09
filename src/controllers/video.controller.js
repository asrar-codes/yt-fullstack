import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const thumbFile = req.files?.thumbnail[0]?.path;
  const videoFile = req.files?.videoFile[0]?.path;

  if (!title) throw new ApiError(400, "title file is required!!..");
  if (!description) throw new ApiError(400, "description file is required!!..");
  if (!videoFile) throw new ApiError(400, "video file is required!!..");
  if (!thumbFile) throw new ApiError(400, "thumbnail  is required!!..");

  const cloudVideo = await uploadOnCloudinary(videoFile);
  const cloudThumb = await uploadOnCloudinary(thumbFile);
  if (!cloudVideo)
    throw new ApiError(402, "something went wrong while uploading vidoe....");
  if (!cloudThumb)
    throw new ApiError(
      402,
      "something went wrong while uploading thumbnail ..!!"
    );
  console.log("metadata: ", cloudVideo.metadata);

  const video = await Video.create({
    videoFile: cloudVideo.url,
    thumbnail: cloudThumb.url,
    duration: 10, // TODO: change this to actual duration of vieo
    owner: req.user,
    title,
    description,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, video, "vidoe uploaded  successfully !.."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) throw new ApiError(400, "videoId is required!!..");
  console.log(videoId);
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, `no video found with id: ${videoId} `);
  return res.status(200).json({ video, msg: "video fetched successfully !.." });
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
