const express = require('express')
const app = express();
const auth = require('./auth');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());

//Routes
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

//Starting server
app.listen(app.get('port'), () => {
  console.log('Example app listening on port',app.get('port'))
});