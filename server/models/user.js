const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  })
}

var User = mongoose.model('User', UserSchema);

module.exports = { User }