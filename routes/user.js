var express = require('express');
var router = express.Router();
var User = require('../models/user');
var randomstring = require("randomstring");
var bcrypt = require('bcryptjs');
var Message= require('../models/message');
var jwt= require('jsonwebtoken');
/*var schema = new Schema({
    googleId:String,
    credits: { type:Number,default:0 },
    localId:String,
    username:String,
    verified:{type:Boolean, default:false},
    verifyRand:String,
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    messages:[{type:Schema.Types.ObjectId, ref:'Message'}]
});*/
router.post('/signin',function(req,res,next){
    User.findOne({$or: [{'email': req.body.email}, {'username': req.body.email}]},
function(err,user){
    console.log("test1");
    if(err){
        return res.status(500).json({
            title:'An error occured',
            error:err
        });
    }
    if(!user){
        return res.status(401).json({
           title:'Login failed',
           error:{message:'Invalid login credentials'}
        });
    }
    console.log("test2");
    if(!user.verified){

    }
    if(!bcrypt.compareSync(req.body.password,user.password))
        {
            return res.status(401).json({
                title:'Login failed',
                error:{message:'Invalid login credentials'}
            });
        }
    var token = jwt.sign({user: user},'secret',{expiresIn:7200});
    res.status(200).json({
        message: 'Successfully logged in',
        token:token,
        userId: user._id
    });


})
});
router.post('/', function (req, res, next) {
    var random = randomstring.generate();
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email:  req.body.email,
        verified: true,
        verifyRand:random,
        username: req.body.username
    });
    console.log(user);
    user.save(function(err,result){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj:result
        });
    });
});
//$or: [{'email': email}, {'username': email}]}





module.exports = router;
