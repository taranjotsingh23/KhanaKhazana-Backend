const express = require('express');
const app= express();
const dotenv=require('dotenv');
const port = process.env.PORT || 3000;
const mongoose=require('mongoose');

//IMPORT ROUTES
const authRoute=require('./routes/auth');
const filesRoute=require('./routes/files');
const findResRoute=require('./routes/findRes');
const findNgoRoute=require('./routes/findNgo');
const ngoWorkRoute=require('./routes/ngoWork');
const paymentRoute=require('./routes/payment');
const giveStarsRoute=require('./routes/giveStars');
const resDetailsRoute=require('./routes/resDetails');
const publicDetailsRoute=require('./routes/publicDetails');
const resOrdersRoute=require('./routes/resOrders');
const ngoDetailsRoute=require('./routes/ngoDetails');
const ngoDistributionRoute=require('./routes/ngoDistribution');
const ngoFilesRoute=require('./routes/ngoFiles');
const orderDoneRoute=require('./routes/orderDone');
const downloadRoute=require('./routes/download');
const sendRevertRoute=require('./routes/sendRevert');
const postRoute=require('./routes/posts');
const cors = require("cors");
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

var corsOptions = {
  origin: ["https://khana-khazana-nine.vercel.app","https://khana-khazana.ayushtyagi14.repl.co","http://localhost:3000"],
};

app.use(cors(corsOptions));

// ROUTE MIDDLESWARES
app.use('/api/user',authRoute);
app.use('/api',filesRoute);
app.use('/api/ngo',findResRoute);
app.use('/api/ngo',findNgoRoute);
app.use('/api/ngo',ngoWorkRoute);
app.use('/api/ngo',giveStarsRoute);
app.use('/api/public',paymentRoute);
app.use('/api/res',resDetailsRoute);
app.use('/api/public',publicDetailsRoute);
app.use('/api/res',resOrdersRoute);
app.use('/api/ngo',ngoDetailsRoute);
app.use('/api/ngo',ngoDistributionRoute);
app.use('/api/ngo',ngoFilesRoute);
app.use('/api/res',orderDoneRoute);
app.use('/files/download',downloadRoute);
app.use('/api/ngo',sendRevertRoute);
app.use('/api/posts',postRoute);

app.listen(port,() => {
    console.log(`Server is running at Port Number ${port}`);
});
