export const asyncHandler = (requestHandler) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

// const asyncHandler = (fn)=>async(req,res,next)=> {
// try {
//  await fn(req, res, next)
// } catch (error) {
//  res.status(err.code || 500).json({
//   success:true,
//   message:err.message,
//  })
// }
// }