const mongoose = require("mongoose");

const users = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    country: String,
    email: String,
    password: Strings,
});

const articles = new mongoose.Schema({
    title: String,
    description: String,
    author: ObjectId,
});

const user = mongoose.model("User", users);
const article = mongoose.model("Article", articles);

module.exports.User = user;
module.exports.Article = article;