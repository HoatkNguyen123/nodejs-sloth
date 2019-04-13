var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');

var UserModel = require('../model/User.js');
const { hash, compare } = require('../lib/bcrypt')
const { sign, verify } = require('../lib/jwt')

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', checkAdmin, function(req, res, next) {
  res.render('admin/main/index');
});

router.get('/dang-nhap.html', function(req, res, next) {
  res.render('admin/login/index');
});




router.post('/dang-nhap.html',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/admin/dang-nhap.html',
                                   failureFlash: true })
);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },

  function(username, password, done) {
      UserModel.findOne({email: username}, function(err, username){
          if(err) throw err;
          if(username){
            bcrypt.compare(password, username.password, function(err, user) {
                if(err) throw err;
                if(user){
                     return done(null, username);
                }else{
                   return done(null, false, { message: 'Tài Khoảng Không Đúng' });
                }
            });
          }else{
             return done(null, false, { message: 'Tài Khoảng Không Đúng' });
          }
      });
  }

));

passport.serializeUser(function(email, done) {
  
  done(null, email.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, email) {
    done(err, email);
  });
});


router.post('/getUser',checkAdmin, function (req, res) {
    res.json(req.user);
});
router.get('/dang-xuat.html',checkAdmin, function (req, res) {
    req.logout();
    res.redirect('/admin/dang-nhap.html');
});


function checkAdmin(req, res, next){
   
    if(req.isAuthenticated()){
      next();
    }else{
      res.redirect('/admin/dang-nhap.html');
    }
}

module.exports = router;