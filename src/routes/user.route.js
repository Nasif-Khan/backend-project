import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// routes the user to the registerUser function in the user.controller.js file  
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser)


router.route("/login").post(verifyJWT, loginUser)

export default router;