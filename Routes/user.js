const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../Schemas/schema')

const router = express.Router();

const connectionString = 'mongodb+srv://deep:deep99@cluster0-btif2.mongodb.net/test?retryWrites=true&w=majority';

router.get('/checkUser' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        const email = request.body.email;
        const password = request.body.password;

        User.findOne({email : email, password : password})
        .then((item) => {
            response.status(200).json(item);
        })
        .catch((err) => {
            response.status(404).json({'message' : 'no user found'});
        });
    })
    .catch((error) => {
        response.status(500).json(error);
    });
});

router.post('/' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        const user = new User(request.body.user);
        const email = user.email;

        User.find({email : email})
        .then((item) => {
            if(item == []){
                user.save()
                .then((doc) => {
                    response.status(200).json(doc);
                })
                .catch((errr) => {
                    response.status(500).json(errr);
                })
            }
            else{
                response.status(409).json(item);
            }
        })
        .catch((err) => {
            response.status(500).json(err);
        })
    })
    .catch((error) => {
        response.status(500).json(error);
    });
});

module.exports = router;