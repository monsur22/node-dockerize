import CryptoJS from 'crypto-js';
import User from '../model/User.js';
import PasswordReset from '../model/PasswordReset.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as fs from 'fs';
const test = async (req, res) => {
    res.send('auth controller');
};
const codeGenerated = async (req, res) => {
    let emailCode = Math.random().toString(36).slice(2, 7);
    var hash = CryptoJS.SHA256(emailCode);
    var a = hash.toString(CryptoJS.enc.Base64)

    const reg = /[!@#$%^&?/*]/g;
    const str = "ava3f/oo?##bar4Script";
    const newStr = str.replace(reg, "_");
    res.send(a);
};
const createUser = async (req, res) => {
    let emailCode = Math.random().toString(36).slice(2, 7);
    let hash = CryptoJS.SHA256(emailCode);
    var code = hash.toString(CryptoJS.enc.Base64);
    const reg = /[!@#$%^&?/*]/g;
    var confirm_code = code.replace(reg, "_");

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_code: confirm_code,
    });
    user.save().then(data => {
        res.send({
            message: "User created successfully!!",
            user: data
        });
        confirmMail(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user"
        });
    });

};
const registerVerify = async (req,res) => {
    const { confirm_code } = req.params;
    const user = await User.findOne({ confirm_code: confirm_code });
    if (user) {
        user.isVerified = true
        const updatedUser = await user.save()
        res.json(updatedUser)
    } else {
        res.status(404).send("Sorry can't find data!")
    }
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.send({message: "Invalid email or password."});
    }else if(user.isVerified == false) {
        return res.status(401).json({message: "Your don't verify your email yet.", status: 401})
    }else{
        user.matchPassword(password)
        return res.status(201).json({
            user,
            // _id: user._id,
            // name: user.name,
            // email: user.email,
            token: generateToken(user._id)
        })
    }
    console.log(user);

};
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
    })
}
const resetPassword = async (req,res) => {
    let emailCode = Math.random().toString(36).slice(2, 7);
    let hash = CryptoJS.SHA256(emailCode);
    var code = hash.toString(CryptoJS.enc.Base64);
    const reg = /[!@#$%^&?/*]/g;
    var confirm_code = code.replace(reg, "_");
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user &&  user.isVerified == true) {
        const token_exist = await PasswordReset.findOne({ email: email });
        if(token_exist) {
            const updateToken = await PasswordReset.findOneAndUpdate({ email: email }, { token: confirm_code });
            res.status(201).json(updateToken)
        }else{
            const passwordReset = new PasswordReset({
                email: email,
                token: confirm_code,
            })
            const createdResetToken = await passwordReset.save()
            res.status(201).json(createdResetToken)
        }
        resetConfirmMail(user,confirm_code)
    } else {
        res.status(404).send("Sorry can't find data!")
    }
};

const updatePassword = async (req, res) => {
    const { confirm_code } = req.params;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const token_exist = await PasswordReset.findOne({ confirm_code: confirm_code });
    if(token_exist) {
        const user_data = await User.findOne({ email: token_exist.email });
        const update_user = await User.findOneAndUpdate({ email: token_exist.email }, { password: passwordHash }).then(data => {
            res.send({
                message: "update password successfully",
                update_user: data,
                token: generateToken(user_data._id)
            });
            PasswordReset.findOneAndDelete({ email: token_exist.email }).exec();
            passwordUpdateMail(token_exist)

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user"
            });
        });
    }else{
        res.status(404).send("Invalid token")
    }

};
const jwtGenerated = async (req, res) => {
    let token;
    let JWT_SECRET = "123";
    token = jwt.sign({user: "admin"}, JWT_SECRET, {expiresIn: "1h"});

    res.status(201)
        .json({
            success: true,
            data: {
                token: token
            },
        });
};

const transporter = nodemailer.createTransport({
    host: "mailhog",
    port: 1025
});

const confirmMail = async(user) => {
    const data = await ejs.renderFile("views/confirm_mail.ejs",{user}, {async: true});
    const messageStatus = transporter.sendMail({
    from: process.env.SERVER_MAIL,
    to: user.email,
    subject: process.env.REGISTER_MAIL_SUB,
    html: data
    }).catch(err => console.log(err));
};

const resetConfirmMail = async(user,confirm_code) => {
    const data = await ejs.renderFile("views/password_reset_mail.ejs",{user,confirm_code}, {async: true});
    const messageStatus = transporter.sendMail({
    from: process.env.SERVER_MAIL,
    to: user.email,
    subject: process.env.RESET_MAIL_SUB,
    html: data
    }).catch(err => console.log(err));
};

const passwordUpdateMail = async(user) => {
    const data = await ejs.renderFile("views/password_update.ejs",{user}, {async: true});
    const messageStatus = transporter.sendMail({
    from: process.env.SERVER_MAIL,
    to: user.email,
    subject: process.env.UPDATE_PASSWORD,
    html: data
    }).catch(err => console.log(err));
};
export {
    test,
    createUser,
    codeGenerated,
    jwtGenerated,
    confirmMail,
    registerVerify,
    resetConfirmMail,
    resetPassword,
    updatePassword,
    loginUser
}