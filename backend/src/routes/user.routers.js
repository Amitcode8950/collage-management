import { Router } from "express";
import { login, logout, signup } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get((req, res) => {
    res.send("User Route is working");
});

router.post("/signup", upload.single('image'), signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;