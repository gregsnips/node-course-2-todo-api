const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

// Here we set up our routes
// - this is the GET routes

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

// - this is the GET routes
app.get('/todos', (req, res) => {
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});


//Here we demonstrate how to create an api route for fetching an individual Todo
//GET /todos/1234324. the 1234324 part needs to be dynamic. Example below Id is dynamic
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  //res.send(req.params);  // This was just to show that we actually got the id value

   //Challenge
    //Validate id using isValid
      if(!ObjectID.isValid(id)) {
        //console.log('ID not valid');
        // 404 - Send back empty send
        return res.status(404).send();
      }


  //findById
   //Success
    //if there is todo - send it back
    // if no todo - send back 404 with empty body.
   // error
     //400-send empty body back
     Todo.findById(id).then((todo) => {
       if (!todo) {
        // console.log('Id not found');
         return res.status(404).send();
       }
       res.send({todo});
     }).catch((e) => res.status(400).send());
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
