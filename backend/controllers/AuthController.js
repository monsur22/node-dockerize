import User from '../model/User.js';
import PasswordReset from '../model/PasswordReset.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import crypto from 'crypto';
import { tokenBlacklist } from '../middleware/auth.js';

/*
-----------------------------------------------------------
| createUser funciton create user accoording to some logic.
-----------------------------------------------------------
*/
const createUser = async (req, res) => {
    const confirm_code = generateRandomCode(32);
    console.log(confirm_code)

    const user = new User({
        email: req.body.email,
        confirm_code: confirm_code,
    });
    const userExists = await User.findOne({
        email: req.body.email
    })
    if (userExists && !userExists.isVerified) {
        userExists.confirm_code = confirm_code;
        const updatedUser = await userExists.save();
        res.send({
            message: "User updated successfully!",
            user: updatedUser,
            token: generateToken(updatedUser._id)
        });
        confirmMail(updatedUser);
    }else if (userExists) {
        res.status(409).send({
            message: "Email already exists!"
        });
    }else {
        user.save().then(data => {
            res.send({
                message: "User created successfully!!",
                user: data,
                token: generateToken(user._id)
            });
            confirmMail(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user"
            });
        });
    }
};
/*
-----------------------------------------------------
| registerVerify funciton verify register user email.
-----------------------------------------------------
*/
const registerVerify = async (req, res) => {
    try {
        const { confirm_code } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send({message:"Passwords do not match"});
        }

        const user = await User.findOne({ confirm_code });
        if (!user) {
            return res.status(404).send({message:"User not found"});
        }
        if (user.isVerified) {
            return res.status(400).send({message:"User already verified"});
        }
        user.isVerified = true;
        user.password = password;
        const updatedUser = await user.save();
        return res.status(200).send({message:"User verified successfully"});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:"Something went wrong"});
    }
};


/*
--------------------------------------------------------------------------
| loginUser funciton login user. If token in tokenBlacklist prevent login.
--------------------------------------------------------------------------
*/
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password.", status: 401 });
        } else if (user.isVerified == false) {
            return res.status(401).json({ message: "Your don't verify your email yet.", status: 401 });
        } else {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password.", status: 401 });
            }
            return res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id)
            });
        }
};
/*
--------------------------------------------------------------------
| logoutUser function logout user and store token in tokenBlacklist.
--------------------------------------------------------------------
*/
const logoutUser = (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    tokenBlacklist.push(token);
    res.json({ message: "You have been logged out." });
    console.log(tokenBlacklist)
};
/*
---------------------------------------------
| generateToken function generate jwt token.
---------------------------------------------
*/
const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}
/*
---------------------------------------------
| updatePassword function update password if:
| confirm_code is valid or return invalid.
---------------------------------------------
*/
const resetPassword = async (req, res) => {
    const confirm_code = generateRandomCode(32);

    const {
        email
    } = req.body;
    const user = await User.findOne({email: email});
    if (user && user.isVerified) {
        const token_exist = await PasswordReset.findOne({
            email: email
        });
        if (token_exist) {
            const updateToken = await PasswordReset.findOneAndUpdate({
                email: email
            }, {
                token: confirm_code
            },{new: true} );
            res.status(201).json(updateToken)
        } else {
            const passwordReset = new PasswordReset({
                email: email,
                token: confirm_code,
            })
            const createdResetToken = await passwordReset.save()
            res.status(201).json(createdResetToken)
        }
        resetConfirmMail(user, confirm_code)
    } else if (user && !user.isVerified) {
        res.status(401).send({message:"Your email address has not yet been verified. Please check your inbox for a verification email or contact customer support for assistance."})
    } else {
        res.status(400).send({message:"Sorry can't find data!"})
    }
};
/*
---------------------------------------------
| updatePassword function update password if:
| confirm_code is valid or return invalid.
---------------------------------------------
*/
const updatePassword = async (req, res) => {
    const { confirm_code } = req.params;
    const { password } = req.body;

    const resetRequest = await PasswordReset.findOne({ token: confirm_code });
    if (!resetRequest) {
        return res.status(404).json({ message: 'Password reset request not found' });
    }
    const user = await User.findOne({ email: resetRequest.email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.password = password;
    await user.save();
    await resetRequest.delete();
    passwordUpdateMail(resetRequest)
    res.status(200).json({ message: 'Password updated successfully' });
};
/*
-------------------------------------------------------------------------
| generateRandomCode function generate random code for confirmation code.
-------------------------------------------------------------------------
*/
const generateRandomCode = (length = 16) => {
    return crypto.randomBytes(length).toString('base64')
        .replace(/[/+=]/g, '_')
        .slice(0, length);
    };
/*
-------------------------------------
| Email functionaliy Start from here.
-------------------------------------
*/
const transporter = nodemailer.createTransport({
    host: "mailhog",
    port: 1025
});

const confirmMail = async (user) => {
    const data = await ejs.renderFile("views/confirm_mail.ejs", {
        user
    }, {
        async: true
    });
    const messageStatus = transporter.sendMail({
        from: process.env.SERVER_MAIL,
        to: user.email,
        subject: process.env.REGISTER_MAIL_SUB,
        html: data
    }).catch(err => console.log(err));
};

const resetConfirmMail = async (user, confirm_code) => {
    const data = await ejs.renderFile("views/password_reset_mail.ejs", {
        user,
        confirm_code
    }, {
        async: true
    });
    const messageStatus = transporter.sendMail({
        from: process.env.SERVER_MAIL,
        to: user.email,
        subject: process.env.RESET_MAIL_SUB,
        html: data
    }).catch(err => console.log(err));
};

const passwordUpdateMail = async (user) => {
    const data = await ejs.renderFile("views/password_update.ejs", {
        user
    }, {
        async: true
    });
    const messageStatus = transporter.sendMail({
        from: process.env.SERVER_MAIL,
        to: user.email,
        subject: process.env.UPDATE_PASSWORD,
        html: data
    }).catch(err => console.log(err));
};
/*
-------------------------------------------------------------
| checkAuthenticate function check only auth user can access.
-------------------------------------------------------------
*/
const checkAuthenticate = async (req, res) => {
    res.send('auth controller');
};


export {
    createUser,
    // userCreate,
    confirmMail,
    registerVerify,
    resetConfirmMail,
    resetPassword,
    updatePassword,
    loginUser,
    logoutUser,
    checkAuthenticate,
}