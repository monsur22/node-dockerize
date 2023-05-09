import express from 'express';
import {protect,protectedRoute} from '../middleware/auth.js'
import {
    createUser,
    // userCreate,
    registerVerify,
    resetPassword,
    updatePassword,
    loginUser,
    logoutUser,
    checkAuthenticate
} from '../controllers/AuthController.js'

const authRouter = express.Router();

// Authentication routes
// authRouter.post('/register', userCreate);
authRouter.post('/registration', createUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', protectedRoute, logoutUser);
authRouter.get('/email-verify/:confirm_code', registerVerify);

// Password reset routes
authRouter.post('/reset-password', resetPassword);
authRouter.post('/reset-password/:confirm_code', updatePassword);

// Protected route for testing purposes
authRouter.get('/', protectedRoute, checkAuthenticate);

/***    This  route will be for view password update form  ***
router.route("/reset-password/:confirm_code").get(getViewPage);
***    This  route will be for view password update form     ******/


export default authRouter