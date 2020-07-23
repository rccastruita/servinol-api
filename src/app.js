const express = require('express')
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors')

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());
app.use(cors());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './resources/tmp/'
}));

//Routes
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/genres', require('./routes/genre.routes'));
app.use('/api/purchases', require('./routes/purchase.routes'));

//Starting server
app.listen(app.get('port'), () => {
  console.log('Example app listening on port',app.get('port'))
});