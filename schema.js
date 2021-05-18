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
    author: {type: mongoose.Schema.ObjectId, ref:"User"}
});

const user = mongoose.model("User", users);
const article = mongoose.model("Article", articles);

module.exports.UserModel = user;
module.exports.ArticleModel = article;