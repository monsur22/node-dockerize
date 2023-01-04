import express from 'express';
const router = express.Router()
import {
    createUser,
    codeGenerated,
    jwtGenerated,
    confirmMail,
    registerVerify,
    resetPassword,
    updatePassword,
    loginUser,
    test
} from '../controllers/AuthController.js'
// import {protect,admin} from '../middleware/authMeddleware.js'


router.route("/").get(test);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/email-verify/:confirm_code").get(registerVerify);
router.route("/reset-password").post(resetPassword);
router.route("/reset-password/:confirm_code").post(updatePassword);

/***    This  route will be for view password update form  ***
router.route("/reset-password/:confirm_code").get(getViewPage);
***    This  route will be for view password update form     ******/

router.route("/code").get(codeGenerated);
router.route("/jwt").get(jwtGenerated);
router.route("/email").get(confirmMail);
// router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

export default router