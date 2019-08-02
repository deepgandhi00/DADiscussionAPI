const express = require('express');
const bodyParser = require('body-parser');
const user = require('./Routes/user');
const post = require('./Routes/post');

const app = express();
app.use(bodyParser.json());
app.use('/user',user);
app.use('/post',post);

app.listen(9000);