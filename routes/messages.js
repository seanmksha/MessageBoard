var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt= require('jsonwebtoken');
var Message= require('../models/message');
var User = require('../models/user');
/**
 * Check messages with the same firstName
 */
router.get('/',function(req,res,next){
    Message.find()
    .populate('user','firstName')
    .exec(function(err,messages){
        if(err)
            {
                return res.status(500).json({
                    title:'An error occured',
                    error:err
                });
            }
            res.status(200).json({
                message:'Success',
                obj: messages
            })
    });

});

/**
 * Verify if the user is authenticated
 */
router.use('/',function(req,res,next){
    jwt.verify(req.query.token,'secret',function(err,decoded){
        if(err){
            return res.status(401).json({
                title:'Not authenticated',
                error:err
            });
        }
        next();
    });
});

/**
 * Save messages
 */
router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id,function(err,user){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        var message = new Message({
            content:req.body.content,
            username:user.username,
            user:user._id
        });
        message.save(function(err,result){
            if(err){
                return res.status(500).json({
                    title:'An error occured',
                    error:err
                });
            }
            user.messages.push(result);
            user.save();
            console.log("Message saved!"+result);
            res.status(201).json({
                message:'Saved message',
                obj: result
            });
        });
    });
    
});
/**
 * Update messages
 */
router.patch('/:id',function(req,res,next){
    var decoded= jwt.decode(req.query.token);
    Message.findById(req.params.id, function(err, message){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        if(!message){
            return res.status(500).json({
                title:'No Message Found!',
                error: {message: 'Message now found'}
            }); 
        }
        if(message.user!=decoded.user._id){
            return res.status(401).json({
                title:'Not authenticated',
                error:{message:'Users do not match'}
            });
        }
        message.content=req.body.content;
       message.save(function(err,result){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        res.status(200).json({
            message:'Updated message',
            obj: result
        });
       });
    });
});

/**
 * Delete messages
 */
router.delete('/:id',function(req,res,next){
    var decoded= jwt.decode(req.query.token);
    Message.findById(req.params.id, function(err, message){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        if(!message){
            return res.status(500).json({
                title:'No Message Found!',
                error: {message: 'Message now found'}
            }); 
        }
        if(message.user!=decoded.user._id){
            return res.status(401).json({
                title:'Not authenticated',
                error:{message:'Users do not match'}
            });
        }
       message.remove(function(err,result){
        if(err){
            return res.status(500).json({
                title:'An error occured',
                error:err
            });
        }
        res.status(200).json({
            message:'Deleted message',
            obj: result
        });
       });
    });
});

module.exports = router;
