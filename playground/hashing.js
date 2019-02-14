const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});
// asynchronous function
// first argument is number of rounds you want to use to generate the salt. bigger the number the longer the algorithm is going to take. Some people use 120 rounds. They intentionally make it longer so no one can brute force these calls
// salt is built-in to hash

var hashedPassword = '$2a$10$jGI86YD3wlu5CgQntxOfjuYLm4Y3tWLH1bixXy4YpBJopg8ib3Sa2'

bcrypt.compare('123!', hashedPassword, (err, res) => {
  console.log(res);
})
// result is either true or false

// what we're gonna do when we log in the user
// we're gonna fetch the hashedPassword value out of the database
// we're gonna compare it to the plain text value they gave us
// use response variable to determine whether or not password was correct


// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');
// // takes two arguments, object you want to hash and secret
// // value we will send back to the user when they sign up or log in.

// console.log(token)

// var decoded = jwt.verify(token, '123abc')
// // takes two arguments, token we want to verify and secret. secret should be the same
// // only when the token is unaltered and the secret is the same are we going to get the data back

// console.log('decoded', decoded);


// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//   id: 4
// };

// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed. Do not trust!')
// }

