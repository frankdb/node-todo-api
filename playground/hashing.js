const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');
// takes two arguments, object you want to hash and secret
// value we will send back to the user when they sign up or log in.

console.log(token)

var decoded = jwt.verify(token, '123abc')
// takes two arguments, token we want to verify and secret. secret should be the same
// only when the token is unaltered and the secret is the same are we going to get the data back

console.log('decoded', decoded);


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

