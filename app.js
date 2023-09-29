if(process.env.NONE_ENV !== "production")
{
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const path = require('path')
const methodOverride = require('method-override')
const campgrounds = require('./router/campground')
const reviews = require('./router/reviewrouters')
const users = require('./router/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStatergy = require('passport-local')
const usermodel = require('./models/user')
const errorClass = require('./Utils/ExpressErrorClass')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection

db.on('error',console.error.bind(console,'Connection Error:'))
db.once('open',()=>{
    console.log('Database Connected')
})

app.engine('ejs', ejsMate)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))


const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 5 
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStatergy(usermodel.authenticate()))

passport.serializeUser(usermodel.serializeUser())
passport.deserializeUser(usermodel.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.Error = req.flash('Error')
    next()
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/review', reviews)
app.use('/',users)

app.get('/home',(req,res)=>{
    res.render('Home')
})

app.all('*',(req,res,next)=>{
    next(new errorClass('Route does not exist',401))
})

app.use((err,req,res,next)=>{
    let{status = 500,message = 'Something Gone Wrong'} = err
    res.status(status).render('campgrounds/Error',{err})
})

app.listen(2001,()=>{
    console.log('listning to port 2001')
})