const mongoose = require("mongoose");

const users = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    country: String,
    email: String,
    password: String,
});

const articles = new mongoose.Schema({
    title: String,
    description: String,
    author: {type: mongoose.Schema.ObjectId, ref:"User"},
    comments: [{type: mongoose.Schema.ObjectId , ref: "Comment"}],
});

const comments = new mongoose.Schema({
    comment : String,
    commenter : mongoose.Schema.ObjectId,
})

const user = mongoose.model("User", users);
const article = mongoose.model("Article", articles);
const comment = mongoose.model("Comment", comments);

module.exports.UserModel = user;
module.exports.ArticleModel = article;
module.exports.CommentModel = comment;