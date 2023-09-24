module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('Error','Please sign in')
        return res.redirect('/login')
    }
    next()
}

