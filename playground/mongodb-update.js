// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


//The MongoClient.connect() below takes two agrs first url/location of your database such as AWS
//The second is a callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//findOneAndUpdate
//Takes the following parms findOneAndUpdate(filter, update, options, callback)

// db.collection('Todos').findOneAndUpdate({
//   _id:new ObjectID('587803d3058d5080ddb4b458')
// }, {
//   $set: {
//     completed: true
//   }
//   }, {
//     returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });

//challenge : update name and use inc function to increment age by 1
db.collection('Users').findOneAndUpdate({
  _id:new ObjectID('587814b3058d5080ddb4bbaf')
}, {
  $set: {
    name: 'Hillary',
  },
  $inc:{
    age: 1
  }
  },
  {
    returnOriginal: false
}).then((result) => {
  console.log(result);
});

  //db.close();
});
