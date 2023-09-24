const mongoose = require('mongoose')
const review = require('./review')

const ImageSchema = new mongoose.Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = { toJSON: {virtuals:true}}
const campGroundSchema = new mongoose.Schema({
    tittle: String,
    images:[ImageSchema],
    price: Number,
    Discription: String,
    Location: String,
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    authour:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)

campGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.tittle}</a></strong>`
})

campGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc.reviews)
    {
        await review.remove({_id:{$in: doc.reviews}})
    }
})

const campGround = mongoose.model('camGround',campGroundSchema)


module.exports = campGround