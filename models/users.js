const mongoose = require('mongoose')

var wishlistSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    urlToImage: String,
})
    


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    wishlist: [wishlistSchema]
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel