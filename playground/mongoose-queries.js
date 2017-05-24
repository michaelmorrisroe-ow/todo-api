const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 

let id = '59245d0e04b69b1e32f3ff71';
console.log(ObjectID.isValid(id));

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findById(id).then(todo => {
//   if (!ObjectID.isValid(id)) {
//     console.log('ID not valid.')
//   }
//   if (!todo) {
//     return console.log('ID not found')
//   }
//   console.log('Todos', todo);
// }).catch(e => console.log(e))



User.findById(id)
  .then(user => {
    if (!ObjectID.isValid(id)) {
      return console.log('Invalid Id');
    }
    if (!user) {
      return console.log('ID not found');
    }
    console.log(user);
  }).catch(e => console.log(e))