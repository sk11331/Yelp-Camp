const campgroundmodel = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async(req,res)=>{
    let{id} = req.params
    let campground = await campgroundmodel.findById(id)
    let review = new Review(req.body.review)
    review.author = req.user._id
    await review.save()
    campground.reviews.push(review)
    await campground.save()
    req.flash('success','created new review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewid} = req.params
    const camp = await campgroundmodel.findByIdAndUpdate(id, {$pull:{reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/campgrounds/${camp._id}`)
}