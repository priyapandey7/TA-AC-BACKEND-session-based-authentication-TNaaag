var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /@/ },
    password: {
      type: String,
      required: true,
      minlength:5
    },
  },
  { timestamps: true }
);

//custom presavehooks
userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    //we use 10 for secrete or salt round starting from itigers salt round starting form 8 to 32
    bcrypt.hash(this.password, 10, (err, hashedpassword) => {
      if (err) return next(err);
      this.password = hashedpassword;
      return next();
    });
  } else {
    next();
  }
});
//compare methods 
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};


module.exports = mongoose.model('User', userSchema);