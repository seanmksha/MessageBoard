var express = require('express');
var router = express.Router();
var User = require('../models/user');
const nodemailer = require("nodemailer");
const keys = require('../config/keys');
var smtpTransport = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: keys.emailerUser,
        pass: keys.emailerKey
    }
});



router.get('/:username/:verifier', async function(req,res)
{
        var username=req.params.username;
        var verifier = req.params.verifier;
        try
        {
            var user= await User.findOne({username:username});
            if(user)
                {
                    if(user.verified==false)
                        {
            if(user.verifyRand==verifier)
                {
                    user.verified=true;
                    var finalUser= await user.save();
                    console.log(username+" was verified.");
                    res.send("Your account was successfully verified!");
                }
                else
                {
                    return res.send({'status':'err','message':'The verifier string is incorrect'});
                }
            }
            else
                {
                    return res.send({'status':'err','message':'User is already verified.'});
                    
                }
            }
            else
                {
                    return res.send({'status':'err','message':'User with that email does not exist.'});
                    
                }
        }
        catch (err) {
            
            return res.status(500).send(err);
        }
        
           
           
});

router.post('/', async function(req, res, next) {
    
    var email =req.body.email;
    req.checkBody('email', 'Email is not valid').isEmail();
    
    console.log(email);
    //try
    //{
        console.log("test1");
       var userInitial = await User.findOne({email:email});
       if(userInitial)
        {
            if(!userInitial.verified)
                {
       var user;
       if(userInitial.verifyRand)
        {
            user=userInitial;
        }
        else
            {
                userInitial.verifyRand=randomstring.generate();
                user= await userInitial.save();
            }
       var verifier = user.verifyRand;
       console.log("test2"+user);
       console.log("test3"+user.username);
       var mailOptions={
           from: "no.reply@krystowers.com",
        to : email,
        subject : "Please confirm your Email account",
        html : "<h3>Welcome to Krys Towers Web Development Apps</h3><p>This email is to verify the account:"+user.username+
        "<div>Click on the following link to verify your account:<a href=\""+
        keys.redirectDomain+"/api/verify/"+user.username+"/"+ verifier+"\">Verify Account</a></div>"
     };
     console.log(mailOptions);
     smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            return res.status(500).json({
                title:'An error occured',
                error:error
            });
               
        }else{
               console.log("Message sent: " + response);
               res.send(user);
               
            }
        });
    }
        else
            {
                
                    return res.status(500).json({
                        title:'An error occured',
                        error:'User associated with that e-mail is already verified.'
                    });
                
                
            }
    }
    else
        {
            return res.status(500).json({
                title:'An error occured',
                error:'User with that e-mail does not exist.'
            });
            
        }
       
    //}
   // catch (err) {
        
     //   return res.status(500).send(err);
   // }

});



module.exports = router;