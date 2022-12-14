var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')


router.post('/add-wishlist', async function(req, res, next) {

var token = req.body.token
var searchUser = await userModel.findOne({token: token})
if(searchUser){  
    var article = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            urlToImage: req.body.urlToImage,
        }
    searchUser.wishlist.push(article)
    let saveUser = await searchUser.save()
    res.send(saveUser)
  }else{
    res.send('error')
  }
}
)

router.delete('/delete-wishlist/:token/:title', async function(req, res, next) {


  var searchUser = await userModel.updateOne({token: req.params.token},
    
    {$pull: {wishlist: {title: req.params.title}}},
    {multi:true})

    if (searchUser.mofifiedCount === 1) {
      res.json('success')
    } else {
      res.json('error')
    }
  });



router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.post('/get-data', async function(req,res,next){

  console.log(req.body.token)
  var wishList = await userModel.findOne({token: req.body.token})

  res.json(wishList.wishlist)


})

module.exports = router;
