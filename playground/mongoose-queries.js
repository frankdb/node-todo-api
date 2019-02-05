const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '5c5a008935c54b009d1f1c9b';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo By ID', todo);
// }).catch((e) => console.log(e));

// User.findById('5c57cdda8b6262d662eb3f30').then((user) => {
//   if(!user) {
//     return console.log('User not found');
//   }
//   console.log('User By ID', user);
// }).catch((e) => console.log(e));

User.findById('5c57cdda8b6262d662eb3f30').then((user) => {
  if (!user) {
    return console.log('Unable to find user');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
})