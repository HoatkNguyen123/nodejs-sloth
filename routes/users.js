const express = require('express')

const { hash, compare } = require('../lib/bcrypt')
const { sign, verify } = require('../lib/jwt')
const UserModel = require('../model/UserKH')
const route = express.Router()

const {redirectIfLoggedIn,checkLogin} = require('../lib/checklogin')




route.get('/register', (req, res) => {
    res.render('user/register');
})

//Xử lí đăng ký
route.post('/register', (req, res) => {
    const { email, password, password_comfirmation } = req.body
    if (!email || email == '') {
        req.flash('error', 'Please enter your email')
        return res.redirect('/users/register')
    }
    if (password !== password_comfirmation) {
        req.flash('error', 'Password comfirmation not match')
        return res.redirect('/users/register')
    }
    //save user
    hash(password)
        .then(hash => {
            return UserModel.create({
                email: email,
                password: hash
            })
        })
        .then(() => {
            return res.redirect('/users/login')
        })
        .catch((err) => {
            console.log(err)

            req.flash('error', 'Cannot register account')
            return res.redirect('/users/register')
        })
})



route.get('/login', (req, res) => {
    res.render('user/login');
})

//Xử lí đăng nhập

route.post('/login', (req, res) => {
    const { email, password } = req.body
    // tim user boi email
    UserModel.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Cannot find User1')
                return res.redirect('/users/login')
            }
            else {
                //compare password
                compare(password, user.password)
                    .then((check) => {
                        if (check) {
                           // sign token  
                            return sign({
                                id: user._id,
                                email: user.email
                            })

                        }
                        else {
                            req.flash('error', 'Cannot find User')
                            return res.redirect('/users/login')
                        }
                    })
                    .then(token => {
                        //save cookie-parser and remember 1 hour
                        res.cookie('token',token,{maxAge:3600000}).redirect('/')
                        
                    })
                    .catch(() => { //return from compare() || sign() 
                        req.flash('error', 'Cannot find User')
                        return res.redirect('/users/login')
                    })
            }
        })
        .catch((err) => {
            console.log(err)

            req.flash('error', 'Cannot find User2')
            return res.redirect('/users/login')
        });

})

route.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/users/login')
})
module.exports = route