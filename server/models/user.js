const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// this is what we need in order to tack on custom methods (such as generateAuthToken). we can't add methods on to user so we need to switch how we generate the model
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// determines what exactly gets sent back when a mongoose model is converted into a JSON value
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  // responsible for taking mongoose variable and converting it to regular object where only the properties available on the document exist

  return _.pick(userObject, ['_id', 'email']);
}

// Object where we can add any method we like. These are going to be your instance methods
// Instance methods do have access to invidual document because we need that information (for example, to create our JSON web token)
// don't use arrow function. arrow functions do not bind a this keyword. we need a this keyword for our methods because the this keyword stores the invdividual document
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  })
}

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  })
}

// .statics - Everything you add on to it turns into a model method as opposed to an instance method
// will take argument - token
UserSchema.statics.findByToken = function (token) {
  var User = this;
  // instance methods get called with the individual document
  // model methods get called with the model as the this binding
  var decoded;
  // why undefined variable? jwt.verify will throw an error if anything goes wrong (secret doesn't match). we want to be able to catch this error

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // })
    return Promise.reject();
  }
  // in catch block, return a promise that will always reject. if this code runs, we never want return User.findOne to run
  // try-catch block. if any errors happens in the try block the code automatically stops execution and moves into the catch block, lets you run some code there, then it continues on with your program

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
    // to query a nested document, wrap our value in quotes
  });
  // for the first time we're going to query our nested object properties
}

// finds user using email and checks if password is correct
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      })
    })
  });
};

// Before we ever save document to the database, we want to make some changes to it
// Need to use regular function, not arrow function for this keyword
// Have to call next. If you don't provide it, middleware will not complete and program will crash
UserSchema.pre('save', function(next) {
  var user = this;

 if (user.isModified('password')) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    })
  });
 } else {
  next();
 }
  // returns true or false
})

var User = mongoose.model('User', UserSchema);

module.exports = { User }