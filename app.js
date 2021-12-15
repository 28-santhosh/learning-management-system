const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');

const port = process.env.PORT || 3000

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://santhosh:Santi2810@cluster0.l68rv.mongodb.net/learning';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(port, function(){
    console.log("Server is up and running on port %d", port);
}))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.get('/courses', requireAuth, (req, res) => res.render('courses'));
app.get('/about', (req, res) => res.render('about'));
app.get('/editprofile', (req, res) => res.render('editprofile'));
app.use(authRoutes);

