const express = require("express");
const { uuid } = require('uuidv4');
const {UserModel, ArticleModel, CommentModel} = require("./schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("./db");
const app = express();
const PORT = 5000;

app.use(express.json());

//Ticket 2.A #2    
const getAllArticles = async (req , res , next)=>{
    const allArticles = await ArticleModel.find({});
    const err = new Error("No Articles Found");
    err.status = 404;
    try {
        res.json(allArticles);
    } catch (err) {
        next(err);
    }
}

app.get('/articles', getAllArticles);


//Ticket 2.A #3 
const getArticlesByAuthor = async (req, res, next) =>{
    const reqAuthor = await req.query.author;
    const foundArticles = await ArticleModel.find({author : reqAuthor});
    try {
        res.json(foundArticles);
    } catch (err) {
        console.log(err);
    }
    
}

app.get('/articles/search_1', getArticlesByAuthor);


//Ticket 2.A #4 
const getAnArticleById = async (req, res, next) =>{
    const reqId = req.query.id;
    const foundArticle = await ArticleModel.findById(reqId).populate("author", "firstName -_id").exec();
    try {
        res.json(foundArticle);
    } catch (err) {
        console.log(err);
    }
}

app.get('/articles/search_2', getAnArticleById);

//Ticket 2.A #1
const createNewArticle = async (req, res, next) =>{
    const {title, description, author} = req.body;
    const newArticle = new ArticleModel({title, description, author});
    try {
        const addedArticle = await newArticle.save();
        res.status(201).json(addedArticle);
    } catch (error) {
        res.json(error);
    }
}

app.post('/articles' , createNewArticle);


//Ticket 2.A #5  
const updateAnArticleById = async (req , res , next) => {
    const id = req.params.id;
    const {title, description, author} = req.body;
    const options = {"new" : true};
    const updatedArticle = await ArticleModel.findByIdAndUpdate(id,{title, description, author},options); 
    try {
        res.status(200).json(updatedArticle);
    } catch (err) {
        console.log(err);
    }
};

app.put('/articles/:id' , updateAnArticleById);

//Ticket 2.A #6 
const deleteArticleById = async (req, res, next) =>{
    const id = req.params.id;
    await ArticleModel.findByIdAndDelete(id); 
    const delObject = {"success": true , "message" : `Successfully deleted article with id => ${id}`};
    try {
        res.status(200).json(delObject);
    } catch (err) {
        console.log(err);
    }       
}

app.delete("/articles/:id", deleteArticleById);

//Ticket 2.A #7
const deleteArticlesByAuthor = async (req, res, next) =>{
    const author = req.body.author;
    await ArticleModel.findOneAndDelete(author);
    const delObject = {"success": true , "message" : `Successfully deleted article by author => ${author}`}
    try {
        res.status(200).json(delObject);
    } catch (error) {
        res.json(error);
    }
}

app.delete("/articles", deleteArticlesByAuthor);



//2.B Ticket #1
const createNewAuthor = async (req,res,next)=> {
    const {firstName, lastName, age, country, email, password} = req.body;
    const newAuthor = new UserModel({firstName, lastName, age, country, email, password});
    try {
        const addedAuthor = await newAuthor.save();
        res.status(201).json(addedAuthor);
    } catch (error) {
        res.json(error);
    }
}

app.post("/users", createNewAuthor);


//2.B Ticket #2
const login = async (req,res,next) =>{
    const {email, password} = req.body;
    const loggedIn = await UserModel.findOne({email, password});
    if(loggedIn){
        res.status(200).json("Valid login credentials")
    }
    else{
        res.status(401).json("Invalid login credentials")
    }
};
    
app.post("/login", login);

//2.B Ticket #3
const createNewComment = async (req,res,next) => {
    const {comment, commenter} = req.body;
    const newComment = new CommentModel({comment, commenter});
    const id = req.params.id;
    try {
        const addedComment = await newComment.save();
        await ArticleModel.update(
            { _id: id }, 
            { $push: { comments: addedComment } },
        );
        res.status(201).json(addedComment);
    } catch (error) {
        res.json(error);
    }

}

app.post("/articles/:id/comments", createNewComment);




/*Error Handler
app.use((err , req , res , next)=>{
    res.status(err.status);
    res.json({
            error : {
            status : err.status,
            message : err.message,
        },
});
});*/

app.listen(PORT, () => {
    console.log(`Project-3 app listening at http://localhost:${PORT}`);
  });