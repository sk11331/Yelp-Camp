const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    Body: String,
    rating: Number,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review