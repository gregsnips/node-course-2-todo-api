var env = process.env.NODE_ENV || 'development';
/* Note we didn't explicitly set the production environment because Heroku automatically sets it for us
   This may be different for other hosting companies. Verify first if using a different service.
*/

if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  });
}
