const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const users = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    country: String,
    email: {type :String, unique: true},
    password: String,
});
//Ticket 3.A #1 
users.pre("save",async function(){
    this.email = this.email.toLowerCase();
    const salt = 10;
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, salt);
})

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


const roles = new mongoose.Schema({
    role: String,
    permissions:['MANAGE_USERS', 'CREATE_COMMENTS']
})

const role = mongoose.model("ROLE", roles);
const user = mongoose.model("User", users);
const article = mongoose.model("Article", articles);
const comment = mongoose.model("Comment", comments);

module.exports.RoleModel = role;
module.exports.UserModel = user;
module.exports.ArticleModel = article;
module.exports.CommentModel = comment;