require('dotenv').config()

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

const { connect } = require('./database/database')
const routes = require('./routes/')

const app = express();
app.use(routes)

// Get port from environment and store in Express.
const port = process.env.PORT || 3000
app.set('port', port)

app.set('view engine', 'jsx');
app.set('views', __dirname + './../views');
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

require('babel/register')({
    ignore: false
});

passport.use(new Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({ fbID: profile.id }, (err, user) => {
      if(err) { console.log(err) }
      if ( !err && user != null) { cb(null, user) }
      else { const user = new User(
        {
          fbID: profile.id,
          name: profile.displayName
        });
        user.save((err) => {
          if(err) {
            console.log(err)
          } else {
            console.log("saving user ...")
            cb(null, user)
          }
        })
      }
    })
    return cb(null, profile)
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user)
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if(!err) done(null, user)
    else done(err, null)
  })
  cb(null, obj)
})

app.use(passport.initialize());
app.use(passport.session());

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true}));
app.use(require('express-session')({secret: 'key', resave: true, saveUninitialized: true}));


// Models

const User = require('./models/user')

// app.get('/', (req, res) => {
//   res.render('login');
// });

app.get('/home', (req, res) => {
  User.findOne({fbID: req.session.passport.user.id}, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      res.render('home', { user: user } )
    }
  })
});

app.get('/welcome', (req, res) => {
  res.render('welcome')
});

app.get('/login/facebook',
  passport.authenticate('facebook')
);

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/welcome')
  }
);

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
});

connect()
app.listen(port)
