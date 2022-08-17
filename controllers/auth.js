exports.getLogin = (req, res, next) => {
  let cookieString = req.get('Cookie');
  if(cookieString){
    console.log(cookieString);

   let cookieArray =  cookieString.split(';');
    cookieArray.forEach( (cookie) => {
      if(cookie.includes('loggedIn')){
        let isAuthenticated=true;
        isAuthenticated = cookie.split('=')[1] == 'true';
      }
    })
  } else {
    console.log('no cookie');
    let isAuthenticated=false;
    res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated : isAuthenticated
  });
};
}
exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};
