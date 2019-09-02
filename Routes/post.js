const express = require('express');
const mongoose = require('mongoose');
const {Post} = require('../Schemas/schema');
const {Comment} = require('../Schemas/schema');
const {Tag} = require('../Schemas/schema');
const {Company} = require('../Schemas/schema');
const mongoosePaginate = require('mongoose-paginate-v2');

const router = express.Router();

const connectionString = 'mongodb+srv://deep:deep99@cluster0-btif2.mongodb.net/test?retryWrites=true&w=majority';

router.get('/recents' , (request,response) => {
    mongoose.connect(connectionString ,{ useNewUrlParser : true})
    .then(() => {
        const page = request.body.page;
        const options = {};
        if(page){
            options.limit = 10;
            options.page = page; 
        }
        else{
            options.limit = 10;
        }
        Post.paginate({},options)
        .then((items) => {
            console.log(items);
            response.status(200).json(items);
        })
        .catch((findErr) => {
            console.log(findErr);
            response.status(500).json(findErr);
        });
    })
    .catch((connectionError) => {
        console.log(connectionError);
        response.status(500).json(connectionError);
    });
});

router.post('/',(request, response) => {
    mongoose.connect(connectionString , {useNewUrlParser: true})
    .then(() => {
        var posts = request.body.post;
        posts._id = new mongoose.Types.ObjectId();
        const post = new Post(posts);
        const tags = post.tag;
        const companies = post.companyTag;
        post.save()
        .then((savedPost) => {
            const values = { '$addToSet' : {'tags' : {'$each':tags}}}
            Tag.updateMany({},
                values
            )
            .then((items) => {
                const cValues = {'$addToSet' : {'companies': {'$each':companies}}}
                Company.updateMany({},
                    cValues
                )
                .then((ite) => {
                    console.log(savedPost);
                    response.status(200).json(savedPost);
                })
                .catch((companyError) => {
                    response.status(500).json({'message' : 'failed to add to company'});
                });
            })
            .catch((tagError) => {
                response.status(500).json({'message' : 'failed to add to tags'});
            });
        })
        .catch((saveError) => {
            response.status(500).json(saveError);
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
        console.log(comment);
        Post.updateOne(
            {_id : request.body.postId },
            { '$push': {comments : comment}}
        )
        .then(numAffected => {
            console.log(numAffected);
            if(numAffected.nModified > 0){
                response.status(200).json({'message':'posted the comment'});
            }
            else{
                response.status(500).json({'message':'failed to update'});
            }
        })
        .catch((updateError) => {
            response.status(500).json(updateError);
        });
    })
    .catch((connectError) => {
        response.status(500).json(connectError);
    });
});

router.get('/getComments' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        Post.findOne({'_id' : request.body.postId, 'comments.type':1})
        .select({'__v':0})
        .populate('comments.userId')
        .exec((err,comments) => {
            if(err){
                response.status(500).json(err);
            }
            else{
                response.status(200).json(comments.comments);
            }
        })
    })
    .catch((connecterror) => {
        response.status(500).json(connecterror);
    });
});


router.get('/getCodes' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        Post.findOne({'_id' : request.body.postId, 'comments.type':2})
        .select({'__v':0})
        .populate('comments.userId')
        .then((posts) => {
            response.status(200).json(posts.comments);
        })
        .catch((Finderr) =>{
            response.status(404).json({'message':'no comments'});
        });
    })
    .catch((connecterror) => {
        response.status(500).json(connecterror);
    });
});


router.get('/getCompaniesTags', (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        let res = {};
        Tag.find()
        .select({'__v':0})
        .then((tags) => {
            res.tags = tags;
            Company.find()
                .then((companies) => {
                    res.companies = companies;
                })
                .catch((companyError) => {
                    response.status(500).json(companyError);
                });
        })
        .catch((tagError) => {
            response.status(500).json(tagError);
        });
    })
    .catch((connectError) => {
        response.status(500).json(connectError);
    });
});

router.get('/getSpecificTag' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        Post.find({ tag: { $in: request.body.tags } })
        .select({'__v':0})
        .exec()
        .then((results) => {
            if(results.length > 0){
                response.status(200).json(results);
            }
            else{
                response.status(404).json({'message':'no data'});
            }
        })
        .catch((findError) => {
            response.status(500).json({'message' : 'error'});
        });
    })
    .catch((connectError) => {
        response.status(500).json(connectError);
    });
});

router.get('/getQueryPosts' , (request,response) => {
    mongoose.connect(connectionString , {useNewUrlParser : true})
    .then(() => {
        const companies = request.body.companies;
        const types = request.body.types;
        Post.find({ 
            companyTag: { $in: companies },  
            tag: { $in: types }
        })
        .select({'__v':0})
        .exec()
        .then((results) => {
            if(results.length > 0){
                response.status(200).json(results);
            }
            else{
                response.status(404).json({'message':'no data'});
            }
        })
        .catch((findError) => {
            response.status(500).json({'message' : 'no data'});
        });
    })
    .catch((connectError) =>{
        response.status(500).json(connectError);
    });
});

module.exports = router;