import CryptoJS from 'crypto-js';
import User from '../model/User.js';
import bcrypt from "bcrypt";
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
    console.log(newStr);
    res.send(a);
};
const userRegister = async (req, res) => {
    let emailCode = Math.random().toString(36).slice(2, 7);
    let hash = CryptoJS.SHA256(emailCode);
    var code = hash.toString(CryptoJS.enc.Base64);
    const reg = /[!@#$%^&?/*]/g;
    var code = code.replace(reg, "_");
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
        confirm_code: code,
    });
    user.save().then(data => {
        res.send({
            message: "User created successfully!!",
            user: data
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user"
        });
    });
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

const emailSend = async(req, res) => {
    // const { email } = req.params;
    var params = "HEllo";
    const data = await ejs.renderFile("views/test.ejs",{params}, {async: true});
    const messageStatus = transporter.sendMail({
    from: "My Company <company@companydomain.org>",
    // to: email,
    to: "My Company <company2@companydomain.org>",
    subject: "Hi Mailhog!",
    text: "This is the email content",
    html: data
    });

    if (!messageStatus) res.json("Error sending message!").status(500);

    res.json("Sent!").status(200);
};
export {
    test,
    userRegister,
    codeGenerated,
    jwtGenerated,
    emailSend
}