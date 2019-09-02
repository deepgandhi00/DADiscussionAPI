const express = require('express');
const bodyParser = require('body-parser');
const user = require('./Routes/user');
const post = require('./Routes/post');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use('/user',user);
app.use('/post',post);

const connect = 'mongodb+srv://jinal:jinal@restaurant-ihl5f.mongodb.net/test?retryWrites=true&w=majority';

app.get('/check' , (request,response) => {
    mongoose.connect(connect , {useNewUrlParser : true})
    .then(() => {
        console.log('hi');
    })
    .catch((err) => console.log(err));
});

app.listen(9000);