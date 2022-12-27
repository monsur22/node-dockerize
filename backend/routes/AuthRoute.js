import express from 'express';
const router = express.Router()
import {codeGenerated, test} from '../controllers/AuthController.js'
// import {protect,admin} from '../middleware/authMeddleware.js'


router.route("/").get(test);
router.route("/code").get(codeGenerated);
// router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

export default router