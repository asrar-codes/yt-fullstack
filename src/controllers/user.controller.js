import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    // console.log(accessToken, refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      // error.message ||
      "some thing went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get details from req.body
  // validate data
  // check if the user already exists
  // check for images, check for avatar
  // upload images to cloudinary,
  // create user objec - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { username, fullname, email, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }
  // Todo:  add validation for email andb password
  // Todo: separate the check for existing user for username and email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log(existedUser);
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists !");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("heh", avatarLocalPath);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log("req.files", req.files.avatar[0]);
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) throw new ApiError(400, "avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("cloud", avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar is required");

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  console.log("user: ", user);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ApiError(500, "something went wrong while registring you !");
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "user registered successfully !..")
    );
});

// login user

const loginUser = asyncHandler(async (req, res) => {
  // get data from req.body
  // username or email
  // find the user
  // check the password
  // generate access and refresh token
  // send cookies
  // send response

  const { username, email, password } = req.body;
  console.log("body", req.body);
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  console.log(username, email, password);
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "user with username/email doesn't exist...!");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect...!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    http: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

// logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true }
    );
    const options = {
      http: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "user logged out successfully"));
  } catch (error) {
    // console.log(first)
    throw new ApiError(500, "something went wrong while logging out");
  }
});

export { registerUser, loginUser, logoutUser };
