// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


//The MongoClient.connect() below takes two agrs first url/location of your database such as AWS
//The second is a callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });


  //deleteOne
  //  db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //    console.log(result);
  //  });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // })


//use deleteMany to remove many
 // db.collection('Users').deleteMany({name: 'Greg'}).then((result) => {
 //   console.log(result);
 // })
//deleteOne
db.collection('Users').findOneAndDelete({_id: new ObjectID('5876c98800a8180c803addba')
}).then((result) => {
  console.log(result);
})
  //db.close();
});
