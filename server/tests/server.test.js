const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
   var text = 'Test todo text';

   request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
     .post('/todos')
     .send({})
     .expect(400)
     .end((err, res) => {
       if(err) {
         return done(err);
       }

       Todo.find().then((todos) => {
         expect(todos.length).toBe(2);
         done();
       }).catch((e) => done(e));
     });
   });
 });

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
     .get('/todos')
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(2);
     }).end(done);
   });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return a 404 if todo not found', (done) =>{
    //make sure you get a 404 back
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 for non-object ids', (done) =>{
    //make sure to get a 404 back
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  })

});

describe('DELETE /:todos/:id', () =>{
  it('should remove a todo', (done) =>{
    var hexId = todos[1]._id.toHexString();

    request(app)
     .delete(`/todos/${hexId}`)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo._id).toBe(hexId);
     })
     .end((err, res) =>  {
       if(err){
         return done(err);
       }

       //Challenge
        //query databse uisng findById toNotExist
        //expect(null).toNotExist();
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
     });
  })
  it('should return 404 if todo not found', (done) =>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);

  })
  it('should return 404 if object is invalid', (done) =>{
    request(app)
    .delete('/todos/123abc')
    .expect(404)
    .end(done);
  })

})

describe('PATCH /todos/:id', () => {
 it('should update the todo', (done) => {
   //grab id of first item
   var hexId = todos[0]._id.toHexString();
   var body = {text: 'Updates from Atom',
                completed: true };
   // update text, set completed true
    request(app)
     .patch(`/todos/${hexId}`)
     .send(body)
     //expect 200
     .expect(200)
     .expect((res) => {
       expect(res.body.todo._id).toBe(hexId);
     })
     .end((err, res) =>  {
       if(err){
         return done(err);
       }
    //custom expect text is changed, verify completed is true and completedAt is a number using .toBeA
       Todo.findById(hexId).then((todo) => {
         expect(res.body.todo.text).toBe(`${body.text}`);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');
         done();
       }).catch((e) => done(e));


 });
 });


   it('should clear completedAt when todo is not completed', (done) => {
 //   //grab id of second todo item
 var hexId = todos[1]._id.toHexString();
 var body = {text: 'Updates from Atom for second todo',
              completed: false };
 // update text, set completed false
  request(app)
   .patch(`/todos/${hexId}`)
   .send(body)
   //expect 200
   .expect(200)
   .expect((res) => {
     expect(res.body.todo._id).toBe(hexId);
   })
   .end((err, res) =>  {
     if(err){
       return done(err);
     }
  //custom expect text is chsnged, completed false, completedAt is null using .toNotExist
     Todo.findById(hexId).then((todo) => {
       expect(res.body.todo.text).toBe(`${body.text}`);
       expect(res.body.todo.completed).toBe(false);
       expect(res.body.todo.completedAt).toNotExist();
       done();
     }).catch((e) => done(e));

  })
});

});


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)  //this is a header
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) =>{

    //Challenge
    //call users me
    // do no provide a token
    // expect a 401
    //expect body is equal to an empty object since user is not authenticated
    //use toEqual not toBe when comparing empty object
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) =>{
      expect(res.body).toEqual({});
    })
    .end(done);

  });
});


describe('POST /users', () =>{
  it('Should create a user', (done) => {
    var email = 'exampl@example.com';
    var password = '123mnb!';

    request(app)
     .post('/users')
     .send({email, password})
     .expect(200)
     .expect((res) => {
       expect(res.headers['x-auth']).toExist();
       expect(res.body._id).toExist();
       expect(res.body.email).toBe(email);
     })
     .end((err) => {
       if (err){
         return done(err);
       }

       User.findOne({email}).then((user) => {
         expect(user).toExist();
         expect(user.password).toNotBe(password); //This verifies stored password is now hashed
         done();
       }).catch((e) => done(e));
     });
  });

  it('Should return validation errors if request invalid', (done) => {
    //Challenge
    //send an invalid email and an invalid password expect 400 to come back
    var email = 'exampl@example';
    var password = '123';

    request(app)
     .post('/users')
     .send({email, password})
     .expect(400)
     .end(done);

  });

  it('Should not create user if email in use', (done) => {
     //Challenge
     //Use an email that is already taken expext a 400
     var email = users[0].email;
     var password = '123ybk5!';

     request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});



describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {

    request(app)
     .post('/users/login')
     .send({
       email: users[1].email,
       password: users[1].password
     })
     .expect(200)
     .expect((res) => {
       expect(res.headers['x-auth']).toExist();
     })
     .end((err, res) =>{
       if(err) {
         return done(err) ;
       }
       User.findById(users[1]._id).then((user) => {
         expect(user.tokens[0]).toInclude({
           access: 'auth',
           token: res.headers['x-auth']
         })
         done();
       }).catch((e) => done(e));
     })

  })
  it('Should reject invalid login', (done) => {
    //Challenge
    request(app)
     .post('/users/login')
     .send({
       email: users[1].email + '1',  //invalid email
       password: users[1].password
     })
     .expect(400)
     .expect((res) => {
       expect(res.headers['x-auth']).toNotExist();
     })
     .end((err, res) =>{
       if(err) {
         return done(err) ;
       }
       User.findById(users[1]._id).then((user) => {
         expect(user.tokens.length).toBe(0);
         done();
       }).catch((e) => done(e));
     })
  })
})
