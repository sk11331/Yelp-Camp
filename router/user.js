const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../Utils/Errorfunction')
const passport = require('passport')
const users = require('../controller/users')

router.route('/register')
    .get(users.renderRegister)
    .post(users.createUser)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:true}),users.userLogin)

router.get('/logout',users.logoutUser)

module.exports = router