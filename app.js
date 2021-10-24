require('dotenv').config()

const express =         require('express');
const app =             express();
const body =            require('body-parser');
var cors =              require('cors');
const mongoose =        require('mongoose');
const multer =          require('multer');
const passport =        require('passport')
// const passportLocal =   require('passport-local').Strategy
const bcrypt =          require('bcrypt')
const cookieParser =    require('cookie-parser')
const session =         require('express-session')
var morgan =            require('morgan')
var fs =                require('fs')
const jwt =             require('jsonwebtoken')
const schedule =        require('node-schedule');
const path =            require('path');
var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  '*'
];
const exampleRoutes =   require('./routes/example');
const userRoutes =      require('./routes/user')

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  exposedHeaders: ['Content-Range'],
  credentials: true
}));

app.use(body.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser("secretcode"))

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
var uploadsDir = require('path').join(__dirname,'/uploads'); 

// remove specified files at midnight
schedule.scheduleJob('0 0 * * *', () => {
  fs.readdir('uploads', (err, files) => {
    files.forEach(file => {
      // remove files with EXAMPLE in name
      if(file.match(/EXAMPLE/)) {
          fs.unlink(uploadsDir + '/' + file, (err) => {
              if (err) {
                  console.error(err);
              }
          });
        }
    });
  });
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
// whitelist get images
app.use('/api/uploads', express.static('uploads'));
// routes related to projects
app.use('/api/example-route', exampleRoutes);
// routes related to user
app.use('/api', userRoutes);

app.use((error, req, res, next) => {
  // error will not be a Multer error.
  if (error instanceof multer.MulterError) {
      res.status(400).send({
        error: 'Multer Error',
        message: error.message,
        field: error.field
      });
  }
});

module.exports = app;

mongoose.connect(process.env.MONGO_PATH,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))
  .catch(() => console.log('Connection to MongoDB failed !'));


