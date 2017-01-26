require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// Here we set up our routes
// - this is the POST routes

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


//Deleting todos
app.delete('/todos/:id', (req, res) => {
  //Challenge

  //get the id
  var id = req.params.id;

  //validate the id -> not valid? Return 404
  if(!ObjectID.isValid(id)) {
    // 404 - Send back empty send
    return res.status(404).send();
  }
       //Remove todo by id
       Todo.findByIdAndRemove(id).then((todo) => {
         //Success
           //if no doc, send a 404
         if (!todo) {
           return res.status(404).send();
         }
           //if doc, send doc back with 200 (no need to specify 200 its default for success)
         res.send({todo});
         //error
            //send 400 with empty body
       }).catch((e) => res.status(400).send());
})


app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }


  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }


Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) =>{
  if (!todo) {
    return res.status(404).send();
  }
  res.send({todo});
}).catch((e) => {
  res.status(400).send();
})

});

//POST /Users
app.post('/users',  (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

// Two types of methods model and instance
// User.findByToken     //This is an example of module method
// user.generateAuthToken     //This is an example of instance method

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});



app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
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
