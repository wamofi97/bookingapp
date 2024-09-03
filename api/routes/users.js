import express from "express"
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js"
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

router.get("/checkauthentication", verifyToken, (req,res,next) => {
    res.send("Hello user, you are logged in")
})

// UPDATE
router.put("/:id", verifyUser, updateUser)

// DELETE
router.delete("/:id", verifyUser, deleteUser)

// GET
router.get("/:id", verifyUser, getUser)

// GET ALL
router.get("/", verifyAdmin, getAllUsers)

export default router