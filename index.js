const express = require('express');
const app= express();
const dotenv=require('dotenv');
const port = process.env.PORT || 3000;
const mongoose=require('mongoose');
const favicon = require('serve-favicon');
const path = require('path');

//IMPORT ROUTES
const authRoute=require('./routes/auth');
const filesRoute=require('./routes/files');
const findResRoute=require('./routes/findRes');
const orderDoneRoute=require('./routes/orderDone');
const downloadRoute=require('./routes/download');
const postRoute=require('./routes/posts');
dotenv.config();

//Connect to DB
try {
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true },() => console.log('Connected to Database'));
}
catch (error) {
    handleError(error);
    console.log(error);
  }

//MIDDLEWARES
app.use(express.json());

app.use(express.static('./public'))
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// ROUTE MIDDLESWARES
app.use('/api/user',authRoute);
app.use('/api',filesRoute);
app.use('/api/ngo',findResRoute);
app.use('/api/res',orderDoneRoute);
app.use('/files/download',downloadRoute);
app.use('/api/posts',postRoute);

app.listen(port,() => {
    console.log(`Server is running at Port Number ${port}`);
});