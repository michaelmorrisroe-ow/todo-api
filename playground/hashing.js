const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// let data = {
//   id: 10
// };

// let token = jwt.sign(data, 'secret');
// console.log(token);

// let decoded = jwt.verify(token, 'secret');
// console.log(decoded);

let password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//    })
// });

hashPass = '$2a$10$zClUoeLq9Ny.SHh8rYyKJuYU.hR/yCB1d0nYWX6yf4lTndU7GM7hy'


bcrypt.compare(password, hashPass, (err, res) => {
  console.log(res);
});