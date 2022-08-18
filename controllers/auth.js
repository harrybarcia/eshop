const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4a1c99b552afa0",
    pass: "92b60fb2b116de"
  }
});
const User = require('../models/user');


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: req.flash('error')[0]
  });
};
exports.getSignup = (req, res, next) => {

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')[0]

  });
};

exports.postLogin = (req, res, next) => {
const email = req.body.email;
const password = req.body.password;
User.findOne({ email: email })
  .then(user => {
    if (!user) {
      req.flash('error', 'Invalid email or password.');

      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
  })

};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists!');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transport.sendMail({
            to: email,
            from: 'me@gmail.com' ,
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        }).catch(err => {
          console.log(err);
        }
        );
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
