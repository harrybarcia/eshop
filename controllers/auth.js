const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // console.log('session');
  // console.log(req.session.isLoggedIn);
  // let cookieString = req.get('Cookie');
  // if(cookieString){
  //   console.log(cookieString);

  //  let cookieArray =  cookieString.split(';');
  //   cookieArray.forEach( (cookie) => {
  //     if(cookie.includes('loggedIn')){
  //       let isAuthenticated=true;
  //       isAuthenticated = cookie.split('=')[1] == 'true';
  //     }
  //   })
  // } else {
  //   console.log('no cookie');
  //   let isAuthenticated=false;
    res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated : false
  });
};
// }
exports.postLogin = (req, res, next) => {
  console.log('session');
  console.log(req.session);
  User.findById('62fbd09500965abe18bc10c6')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
  });
  res.redirect('/');
}