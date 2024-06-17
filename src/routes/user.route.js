import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// routes the user to the registerUser function in the user.controller.js file  
router.route("/register").post(registerUser)




export default router;