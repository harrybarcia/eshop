const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// to secure random values
const crypto = require('crypto');
const {validationResult} = require('express-validator');

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


exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
 crypto.randomBytes(32, (err, buffer) => {
   if (err) {
     console.log(err);
     return res.redirect('/reset');
   }
   // the token should be stored in the database
   const token = buffer.toString('hex');
   User.findOne({ email: req.body.email })
     .then(user => {
       if (!user) {
         req.flash('error', 'No account with that email found.');
         return res.redirect('/reset');
       }
       user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
       return user.save();
       // when user save succeeds, the then function is called
     }).then(result => {
       res.redirect('/');
       return transport.sendMail({
         to: req.body.email,
         from: 'me@gmail.com',
          subject: 'Password reset',
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p> `
        });
      }).catch(err => {
        console.log(err);
      }
      );
  }
  );
}


exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    }).catch(err => {
      console.log(err);
    }
    );
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  }).then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  }).then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(result => {
    res.redirect('/login');
  }).catch(err => {
    console.log(err);
  }
  );
}