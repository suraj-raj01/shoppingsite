import express from 'express'
import { createUser, deleteUser, forgotPassword, getUserById, getUsers, searchUser, updatePassword, updateUser, userLogin, verifyEmail } from '../../controllers/auth/customerController.js';
const route = express.Router();

route.post("/",createUser)
route.get("/",getUsers)
route.get("/:id",getUserById)
route.post("/searchuser/:id",searchUser)
route.put("/:id",updateUser)
route.delete("/:id",deleteUser)
route.post("/login",userLogin)
route.post("/verify-email",verifyEmail)
route.post("/forgot-password",forgotPassword)
route.post("/update-password",updatePassword)

export default route;