const express = require('express');
const mongoose = require('mongoose');
const {Post} = require('../Schemas/schema');
const {Comment} = require('../Schemas/schema');
const {Tag} = require('../Schemas/schema');
const {Company} = require('../Schemas/schema');

const router = express.Router();

const connectionString = 'mongodb+srv://deep:deep99@cluster0-btif2.mongodb.net/test?retryWrites=true&w=majority';

router.get('/recents' , (request,response) => {
    mongoose.connect(connectionString ,{ useNewUrlParser : true})
    .then(() => {
        Post.find()
        .sort({date : 'descending'})
        .limit(10)
        .then((items) => {
            response.statusCode(200).json(items);
        })
        .catch((findErr) => {
            response.statusCode(500).json(findErr);
        });
    })
    .catch((connectionError) => {
        response.statusCode(500).json(connectionError);
    });
});

router.post('/',(request, response) => {
    mongoose.connect(connectionString , {useNewUrlParser: true})
    .then(() => {
        const post = new Post(request.body.post);
        const tags = post.tags;
        const companies = post.companies;
        post.save()
        .then((savedPost) => {
            Tag.update(
                { '$addToSet' : tags}
            )
            .catch((tagError) => {
                response.statusCode(500).json({'message' : 'failed to add to tags'});
            });
            Company.update(
                {'$addToSet' : companies}
            )
            .catch((companyError) => {
                response.statusCode(500).json({'message' : 'failed to add to company'});
            });
            response.statusCode(200).json(savedPost);
        })
        .catch((saveError) => {
            response.statusCode(500).json(saveError);
        });
    })
    .catch((connectError) => {
        response.statusCode(500).json(connectError);
    });
});

router.post('/postComment' ,(request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser: true})
    .then(() => {
        const comment = new Comment(request.body.comment);
        Post.update(
            {_id : request.body.postId },
            { $push: {comments : comment}}
        )
        .then(numAffected => {
            if(numAffected > 0){
                response.statusCode(200).json({'message':numAffected})
            }
            else{
                response.statusCode(500).json({'message':'failed to update'});
            }
        })
        .catch((updateError) => {
            response.statusCode(500).json(updateError);
        });
    })
    .catch((connectError) => {
        response.statusCode(500).json(connectError);
    });
});

router.get('/getComments' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        Post.findOne({_id : request.body.postId})
        .then((item) => {
            response.statusCode(200).json(item.comments);
        })
        .catch((findError) => {
            response.statusCode(404).json(findError);
        });
    })
    .catch((connecterror) => {
        response.statusCode(500).json(connecterror);
    });
});


router.get('/getCompaniesTags', (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        let res = {};
        Tag.find()
        .then((tags) => {
            res.tags = tags;
        })
        .catch((tagError) => {
            response.statusCode(500).json(tagError);
        });

        Company.find()
        .then((companies) => {
            res.companies = companies;
        })
        .catch((companyError) => {
            response.statusCode(500).json(companyError);
        });
    })
    .catch((connectError) => {
        response.statusCode(500).json(connectError);
    });
});

module.exports = router;