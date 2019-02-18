const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

// create two users, one with valid authentication token, one without
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}]

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  // remove wipes the test database of users
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
  
  // We want to wait for both of them to succeed, there's actually a promise utility method for that - promise.all. It takes an array of promises.
  // Callback is not going to fire until all promises get resolved
  // Calling save runs middleware to hash password
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  todos, populateTodos, users, populateUsers
}


