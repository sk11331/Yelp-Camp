const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const campgroundmodel = require('../models/campground')
const cities = require('./cities')
const {places,descriptors, num1} = require('./seedHelpers')

const db = mongoose.connection
db.on('error',console.error.bind(console,'Connection Error'))
db.once('open',()=>{
    console.log('Database Connected')
})

const enterDB = async()=>{
    await campgroundmodel.deleteMany({})
    for(let i=1; i<=500; i++)
    {
      const rannum = Math.floor(Math.random()*1000)
        let data = new campgroundmodel({
            Location:`${cities[rannum].city}-${cities[rannum].state}`,
            tittle:`${places[Math.floor(Math.random()*num1)]}-${descriptors[Math.floor(Math.random()*num1)]}`,
            geometry: {
              type: "Point",
              coordinates: [cities[rannum].longitude,cities[rannum].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dud8fwe2z/image/upload/v1693785100/YelpCamp/hf1cdty8hpsag2xmbwnd.jpg',
                  filename: 'YelpCamp/hf1cdty8hpsag2xmbwnd',
                },
                
              ],
            authour: "646462803ab1ae081e46af59",
            Discription: 'This place is soo good i fell like i am so close to the nature enjoying the climet and the water falls near by',
            price: Math.floor(Math.random()*500)+50
        })
        await data.save()
    }
}

enterDB().then( ()=> {
    mongoose.connection.close()
})