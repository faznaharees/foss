const express= require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session =require('express-session');
const {check,validationResult}=require('express-validator/check');
const passport = require('passport');
const config= require('./config/database');
var fs = require('fs');

mongoose.connect(config.database);

let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to mongoDB');
});

//Check for DB error
db.on('error', function(err){
  console.log(err);
});

//init app
const app =express();
//Bring in models

let Article = require('./models/article');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// body parsr middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var imgpath='/home/fazna/Desktop/ASD-Project-master/public/1.jpg'

/*
app.get('/',function(req,res){
  res.set('Content-Type', 'image/jpg');//Added line
  res.send(fs.readFileSync(imgpath));
});
*/

// parse application/json
app.use(bodyParser.json());

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());




//Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});

//home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Placement Portal',
        articles: articles
      });
    }
  });
});



//Route files
let articles= require('./routes/articles');
let users= require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);


//start server
app.listen(3000,function(){
  console.log('Server started on port 3000...');

});
