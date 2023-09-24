const mongoose = require('mongoose')
const {Schema} = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose)

const usermodel = mongoose.model('User',UserSchema)

module.exports = usermodel