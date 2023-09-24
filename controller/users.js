const User = require('../models/user')
const passport = require('passport')

module.exports.renderRegister = (req,res)=>{
    res.render('user/register')
}

module.exports.createUser = async(req,res,next)=>{
    try{
        let{email,username,password} = req.body
        let user = new User({email,username})
        let registerdUser = await User.register(user,password)
        req.login(registerdUser,err=>{
            if(err){
                return next(err)
            }
            else{
                req.flash('Success','You are registerd and loggedin')
                res.redirect('/campgrounds')
            }
        })
    }catch(e){
        req.flash('Error',e.message)
        res.redirect('/campgrounds')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('user/login')
}

module.exports.userLogin = (req,res)=>{
    req.flash('success','Welcome to campgrounds')
    res.redirect('/campgrounds')
}

module.exports.logoutUser = (req,res)=>{
    req.logout(function(err){
        if(err) {return err}
        req.flash('success','Logged Out')
        res.redirect('/campgrounds')
    });
}