const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 

let id = '59245d0e04b69b1e32f3ff71';
console.log(ObjectID.isValid(id));

// Todo.remove({})

Todo.findOneAndRemove({}).then(todo => {
  console.log(todo);
});

Todo.findByIdAndRemove('5925a67bac198d85a14d2914')
  .then(todo => {
    console.log(todo);
})