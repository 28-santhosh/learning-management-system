const mongoose = require('mongoose');

const {isEmail} = require('validator');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: [true, 'Enter the email'],
    unique: true,
    lowecase: true,
    validate: [isEmail , 'enter a valid mail id']
  },
  password: {
    type: String,
    required: [true, 'Enter the password'],
    minlength: [6, 'Minimum length is character']
  },
});
/*
userSchema.post('save', function(doc, next){
  console.log('new user was created ',doc);
  next();
});*/

userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password){
  const user = await this.findOne({ email });
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error('Incorrect Password !');
  }
  throw Error('Incorrect Mail !')
}

const User = mongoose.model('user', userSchema);

module.exports = User;