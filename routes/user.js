var express = require('express');
var router = express.Router();
var User = require('../models/user');
var randomstring = require("randomstring");
var bcrypt = require('bcryptjs');
var Message= require('../models/message');
var jwt= require('jsonwebtoken');
var User = require('../models/user');
const keys = require('../config/keys');
const nodemailer = require("nodemailer");
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
var smtpTransport = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: keys.emailerUser,
        pass: keys.emailerKey
    }
});
/**
 *  Sign in route: checks to see if an email and username exists, if it doesn't exist create one and send out a verification email
 */
router.post('/signin',function(req,res,next){
    console.log("called");
    User.findOne({$or: [{'email': req.body.email}, {'username': req.body.email}]},
function(err,user){

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
  
    if(!user.verified){
        return res.status(401).json({
            title:'Login failed',
            error:{message:"User's e-mail address is not verified."}
         });
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

/**
 * Submit a create new username request
 */
router.post('/', async function (req, res, next) {
    var verifier = randomstring.generate();

    req.checkBody('firstName','Name is required').notEmpty();
    req.checkBody('lastName','Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    var username= req.body.username;
    var email=req.body.email;
    var errors=req.validationErrors();
    if(errors)
    {
        return res.status(401).json({
            title:'An error occured',
            error:"Missing Fields!"
        });
    }
    
    User.findOne({username:username},function(err,returnedUser){
    if(!returnedUser)
     {
        User.findOne({email:email},function(err,returnedEmail)
        {
            if(err){
              return res.status(500).json({
                 title:'An error occured',
                 error:err
              });
             }
        if(!returnedEmail)
             {
                var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email:  req.body.email,
        verified: false,
        verifyRand:verifier,
        username: req.body.username
    });
    

    user.save(function(err,result){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        var mailOptions={
            from: "no.reply@krystowers.com",
            to : email,
            subject : "Please confirm your Email account",
            html : "<h3>Welcome to Krys Towers Web Development Apps</h3><p>This email is to verify the account:"+user.username+
            "<div>Click on the following link to verify your account:<a href=\""+
            keys.redirectDomain+"/api/verify/"+user.username+"/"+ verifier+"\">Verify Account</a></div>"
         };
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                       console.log(error);
                       return res.status(500).json({
                        title:'An error occured',
                        error:err
                    });
                       
                }else{
                       console.log("Message sent: " + response.message);
                       
                       res.status(201).json({
                        message: 'User successfully created, please verify your email before logging in',
                        obj:result
                    });
                       
                    }
                });





       
    });
             }
    else
        {
            return res.status(500).json({
                title:'An error occured',
                error:"E-mail already registerd. "
            });
        }
     
    });


     }
     else
        {
            return res.status(500).json({
                title:'An error occured',
                error:"Username already registerd. "
            });
        }
    });

});




module.exports = router;
