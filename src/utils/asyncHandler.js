// The purpose of this utility is to simplify error handling in asynchronous 
// Express route handlers or middleware. 

const asyncHandler =  (requestHandler) => {
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

export {asyncHandler}



// const asyncHandler = (fn) => (req, res, next) => {
//     try{
//         await fn (req, res, next);
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             message: error.message || 'An error occurred',
//             success: false
//         })
//     }
// }