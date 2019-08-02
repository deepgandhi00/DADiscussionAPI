const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    date_join : {type : Date, default : new Date()}
});

const CommentSchema = mongoose.Schema({
    userId : String,
    comment : String
});

const CompanySchema = mongoose.Schema({
    companies : [String]
});

const TagSchema = mongoose.Schema({
    tags : [String]
});

const PostSchema = mongoose.Schema({
    userId : String,
    title : String,
    description : String,
    link : String,
    companyTag : [String],
    date : {type : Date , default : new Date()},
    tag : [TagSchema],
    comments : [CommentSchema]
});

const UserModel = mongoose.model('users' , UserSchema);
const PostModel = mongoose.model('posts' , PostSchema);
const CompanyModel = mongoose.model('companies' , CompanySchema);
const CommentModel = mongoose.model('comments' , CommentSchema);
const TagModel = mongoose.model('typetags' , TagSchema);

module.exports = {User : UserModel , Post : PostModel , Company : CompanyModel , Comment : CommentModel , 
    Tag : TagModel};