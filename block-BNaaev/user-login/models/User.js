var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//required bcrypt
var bcrypt = require('bcrypt');


var userSchema = new Schema ({
    name : {type : String , required: true },
    email : {type : String, required : true, unique : true},
    password : {type : String, minlength: 5,required : true},
    age:{ type :Number,required: true },
    phone: { type :Number,minlength :10, maxlength: 10 }
}, {timestamps : true}
);
//presave define in the schema
userSchema.pre('save',function(next){
    if(this.password & this.isModified('password')){
     //method of has the password
       bcrypt.hash(this.password, 10 ,(err,hashed) =>{
        if(err) return next(err);
          this.password = hashed;
            next();
        })
       } else{
        next();
      }
    })

module.exports = mongoose.model('User', userSchema);