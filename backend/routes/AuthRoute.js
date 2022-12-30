import express from 'express';
const router = express.Router()
import {
    userRegister,
    codeGenerated,
    jwtGenerated,
    emailSend,
    test
} from '../controllers/AuthController.js'
// import {protect,admin} from '../middleware/authMeddleware.js'


router.route("/").get(test);
router.route("/register").post(userRegister);
router.route("/code").get(codeGenerated);
router.route("/jwt").get(jwtGenerated);
router.route("/email").get(emailSend);
// router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

export default router