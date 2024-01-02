const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 8008;
const dbURL = process.env.DATABASE_URL;

// MongoDB Connection
mongoose.connect(dbURL);

mongoose.set('strictQuery', false);
 
let db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB!'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/tasks', taskRoutes)

app.listen(port, () => {
	console.log(`API is now running on localhost: ${port}`);
});