import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import AuthRoute from './routes/AuthRoute.js';
import connectDB from './config/db.js'

dotenv.config()
connectDB()
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use("/api/auth", AuthRoute);
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.send('Hello Node Js in Docker!');
});
