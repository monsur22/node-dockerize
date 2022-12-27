import express from 'express';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from './model/User.js';
import bcrypt from "bcrypt";
// import CryptoJS from 'crypto-js';
import AuthRoute from './routes/AuthRoute.js';


dotenv.config()
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use("/api/auth", AuthRoute);
const port = process.env.SERVER_PORT;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected!'))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.send('Hello Node Js in Docker!');
});
// app.get('/code', (req, res) => {
//   const saltRounds = 10;
//   let emailCode = Math.random().toString(36).slice(2, 7);
//   var hash = CryptoJS.SHA256(emailCode);
//   var a = hash.toString(CryptoJS.enc.Base64)
//   res.send('Code generate!'+a);
// });

// app.get('/foo', function (req, res) {
//   res.json({
//     "foo": "bar"
//   });
// });

app.post('/add', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
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

});