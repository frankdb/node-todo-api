var {User} = require('./../models/user');

// this will be the middleware function we use on our routes to make them private
// instead of sending back user - res.send(user), what we're going to do is modify the request object. this means we'll be able to use the modified request object inside of the route down below
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
    // need to call next, otherwise the code in route will never execute
  }).catch((e) => {
    res.status(401).send();
  })
}

module.exports = {authenticate};