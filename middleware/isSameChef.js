module.exports = (req, res, next) => {
    if(!req.session.currentUser._id === req.params.chefId){
        res.redirect('/')
    }
    next();
}