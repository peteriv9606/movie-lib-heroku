var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI

// Middleware

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connection to DB Successfull"))
  .catch((err) => console.error(err))

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

var users = require('./routes/users')
var auth = require('./routes/auth')
var shows = require('./routes/shows')
var favourites = require('./routes/favourites')

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/shows', shows)
app.use('/api/favourites', favourites)



// return static
const path = require("path");

app.use(express.static(path.resolve(__dirname, './frontend/out/')))

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/index.html'));
});
app.get('/shows', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/shows.html'));
});
app.get('/shows/:slug', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/shows/[slug].html'));
});
app.get('/favourites', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/favourites.html'));
});
app.get('/login', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/login.html'));
});
app.get('/register', (req,res) => {
  res.sendFile(path.join(__dirname, './frontend/out/register.html'));
});



