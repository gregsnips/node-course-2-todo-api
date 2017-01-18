const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) :This function will not return the doc

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

/*The two functions below will return the doc*/
//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '587eb9df66430a05e36d5594'}).then((todo) => {
  console.log(todo);
})

Todo.findByIdAndRemove('587eb9df66430a05e36d5594').then((todo) => {
  console.log(todo);
});
