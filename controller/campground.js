const campgroundmodel = require('../models/campground')
const {places,descriptors} = require('../seeds/seedHelpers')
const Review = require('../models/review')
const {cloudinary} = require('../cloudinary')
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
// const mbxToken = process.env.MAPB0X_TOKEN
// const geocoding = mbxGeocoding({accessToken:mbxToken})
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapboxToken})

module.exports.index = (async(req,res)=>{
    let campgrounds = await campgroundmodel.find({})
    res.render('campgrounds/index',{campgrounds})
})

module.exports.renderForm = (req,res)=>{
    res.render('campgrounds/new',{places,descriptors})
}

module.exports.renderShow = async(req,res)=>{
    let{id} = req.params
    let campground = await campgroundmodel.findById(id).populate({
        path:'reviews',
        populate:({
            path:'author'
        })
    }).populate('authour')
    if(!campground){
        req.flash('Error','campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.addCampground = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.Location,
        limit: 1
    }).send()
    let {place,discription} = req.body
    let tittle = `${place}-${discription}`
    let newc = new campgroundmodel({tittle:tittle,price:req.body.price,Discription:req.body.Discription,Location:req.body.Location})
    newc.geometry = geoData.body.features[0].geometry
    newc.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    newc.authour = req.user._id
    await newc.save()
    req.flash('success', 'you have successfully created a camp')
    res.redirect(`/campgrounds/${newc._id}`)
}

module.exports.editPage = async(req,res)=>{
    let camp = await campgroundmodel.findById(req.params.id)
    res.render('campgrounds/edit',{places,descriptors,camp})
}

module.exports.editCampground = async(req,res)=>{
    let{id} = req.params
    //console.log(req.body)
    let{place,discription,Location} = req.body
    let tittle = `${place}-${discription}`
    let ucamp = await campgroundmodel.findByIdAndUpdate(id,{Location:Location,tittle:tittle,price:req.body.price,Discription:req.body.Discription},{runValidators:true,new:true})
    const img = req.files.map(f=>({url:f.path,filename:f.filename}))
    if(img)
    {
        ucamp.images.push(...img)
    }
    await ucamp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await ucamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','successfully updated the information')
    res.redirect(`/campgrounds/${ucamp._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    let {id} = req.params
    let campground = await campgroundmodel.findById(id)
    for(let c of campground.reviews)
    {
        await Review.findByIdAndDelete(c._id)
    }
    for(let img of campground.images){
        await cloudinary.uploader.destroy(img.filename)
    }
    await campgroundmodel.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}