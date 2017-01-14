var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

// Here we set up our routes - this is the POST routes
app.use(bodyParser.json());
app.post('/todos',  (req, res) => {
  //console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});



app.listen(3000, () => {
  console.log('Started on port 3000');
})


module.exports = {app};














// **************Everything below here is for reference only*********
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });


//Challenge create new Todo

// var newTask = new Todo({
//   text: 'View this video again',
//   // completed: true,
//   // completedAt: 123
// });
//
// newTask.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });

//Challenge make a new User model
//email-require it- trim it-set type to sstring - set min length of 1
  //
  // var newUser = new User({
  //   email: 'gregsnips@yahoo.com',
  //   });
  //
  // newUser.save().then((doc) => {
  //   console.log('Saved User', doc);
  // }, (e) => {
  //   console.log('Unable to save User', e);
   //});
