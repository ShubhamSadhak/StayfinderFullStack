const asyncHandler = (requestHandler) =>{
    return (req,res,next) => {
        //Promise.resolve(requestHandler(req,res,next)).catch(next) or
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
        
    }
}

export{asyncHandler}


// const asyncHandler = () => {} or
// const asyncHandler = (func) => () => {} or
// const asyncHandler = (func) => async () => {} or

//using try and catch block :-

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     }catch(error)
//     {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error"
//         })
//     }
// }