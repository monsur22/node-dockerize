import express from 'express';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import mongoose from 'mongoose';
dotenv.config()
const app = express();

const port = 8000;
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://mongo:27017/test?authSource=admin',{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected!'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.send('Hello Node Js in Docker!');
});
app.get('/foo', function (req, res) {
  res.json({
    "foo": "bar"
  });
});
