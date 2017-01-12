// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
//Here is how we can use the destructured object. Comented out as we are showing it as an example
// var obj = new ObjectID();
// console.log(obj);

//The next three lines is an example of es6 object destructuring just like we did above
// var user ={name: 'Greg', age:38}
// var{name} = user;
// console.log(name);


//The MongoClient.connect() below takes two agrs first url/location of your database such as AWS
//The second is a callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

 // db.collection('Todos').insertOne({
 //     text: 'Something to do',
 //     completed: false
 // }, (err, result) =>{
 //   if(err){
 //     return console.log('Unable to insert todo', err)
 //   }
 //
 //     console.log(JSON.stringify(result.ops, undefined, 2));
 // })


// db.collection('Users').insertOne({
//   name: 'Greg',
//   age: 38,
//   location: 'Plainfield'
// }, (err, result) => {
//   if(err){
//     return console.log('Unable to insert users', err)
//   }
//   console.log(result.ops[0]._id.getTimestamp());
// });

  db.close();
});
