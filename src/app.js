const express = require('express')
const app = express();
const fileUpload = require('express-fileupload');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './resources/tmp/'
}));

//Routes
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/img', require('./routes/img.routes'));

//Starting server
app.listen(app.get('port'), () => {
  console.log('Example app listening on port',app.get('port'))
});