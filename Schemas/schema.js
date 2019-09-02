const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const UserSchema = mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId , default : new mongoose.Types.ObjectId()},
    name : String,
    email : String,
    password : String,
    date_join : {type : Date, default : new Date()}
});
const UserModel = mongoose.model('users' , UserSchema);


const CommentSchema = mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId , default : new mongoose.Types.ObjectId()},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    comment : String,
    type : Number
});
const CommentModel = mongoose.model('comments' , CommentSchema);


const CompanySchema = mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId , default : new mongoose.Types.ObjectId()},
    companies : [String]
});
const CompanyModel = mongoose.model('companies' , CompanySchema);


const TagSchema = mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId , default : new mongoose.Types.ObjectId()},
    tags : [String]
});
const TagModel = mongoose.model('typetags' , TagSchema);


const PostSchema = mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId , default : new mongoose.Types.ObjectId()},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title : String,
    description : String,
    link : String,
    companyTag : [String],
    date : {type : Date , default : new Date()},
    tag : [String],
    comments : [CommentSchema]
});
PostSchema.plugin(mongoosePaginate);
const PostModel = mongoose.model('posts' , PostSchema);


module.exports = {User : UserModel , Post : PostModel , Company : CompanyModel , Comment : CommentModel , 
    Tag : TagModel};