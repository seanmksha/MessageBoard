var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var schema = new Schema({
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
});

schema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User',schema);