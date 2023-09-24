const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../Utils/Errorfunction')
const Review = require('../models/review')
const campgroundmodel = require('../models/campground')
const {isLoggedIn} = require('../middleware')
const reviews = require('../controller/reviews')

const isAuthor = async(req,res,next)=>{
    const {id,reviewid} = req.params
    const review = await Review.findById(reviewid)
    if(!review.author.equals(req.user._id)){
        req.flash('Error','You are not author to this review')
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}

router.post('/',isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewid',isLoggedIn,isAuthor,catchAsync(reviews.deleteReview))

module.exports = router