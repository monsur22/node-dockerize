import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import AuthRoute from './routes/AuthRoute.js';


dotenv.config()
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs");
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
