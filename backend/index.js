import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import AuthRoute from './routes/AuthRoute.js';
import connectDB from './config/db.js'

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
try {
  connectDB();
} catch (err) {
  console.error('Failed to connect to the database:', err);
  process.exit(1);
}

// Set the view engine to EJS
app.set("view engine", "ejs");

// Register API routes
app.use("/api/auth", AuthRoute);

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.send('Hello Node Js in Docker!');
});

// Handle errors that occur during processing of requests
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server// Start the server
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
});
