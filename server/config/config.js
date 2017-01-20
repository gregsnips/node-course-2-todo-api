var env = process.env.NODE_ENV || 'development';
/* Note we didn't explicitly set the production environment because Heroku automatically sets it for us
   This may be different for other hosting companies. Verify first if using a different service.
*/
if(env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
