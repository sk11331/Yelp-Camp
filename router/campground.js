const express = require('express')
const router = express.Router()
const catchAsync = require('../Utils/Errorfunction')
const campgroundmodel = require('../models/campground')
const {isLoggedIn} = require('../middleware')
const campgrounds = require('../controller/campground')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

const isAuthor = async(req,res,next)=>{
    let{id} = req.params
    let campground = await campgroundmodel.findById(id)
    if(!campground.authour.equals(req.user._id))
    {
        req.flash('Error','You are allowed to do that action')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

router.get('/new',isLoggedIn,campgrounds.renderForm)

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),catchAsync(campgrounds.addCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.renderShow))
    .put(isLoggedIn,isAuthor,upload.array('image'),catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editPage))

module.exports = router