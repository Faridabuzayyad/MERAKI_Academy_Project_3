const express = require("express");
require("dotenv").config();
//const { uuid } = require('uuidv4');
const {UserModel, ArticleModel, CommentModel, RoleModel} = require("./schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const TOKEN_EXP_Time = process.env.TOKEN_EXP_Time;

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


//3.A Ticket #2
const generateToken = (payload) => {
    const options = {
      expiresIn: TOKEN_EXP_Time,
    };
    return jwt.sign(payload, SECRET, options);
  };

const login = async (req,res,next) =>{
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const loggedIn = await UserModel.findOne({"email" : email});
    if(loggedIn){
        const authenticated = await bcrypt.compare(password, loggedIn.password);
          if(authenticated){
              const payload =  {
                userId: loggedIn._id,
                country: loggedIn.country
                }
              const token = await generateToken(payload);
              res.json(`token: ${token}`)
          }
          else{
            res.status(403).json("The password you’ve entered is incorrect")
          }
    }
    else{
        res.status(404).json("The email doesn't exist")
    }
};
    
app.post("/login", login);

//3.A Ticket #3
const authentication = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    await jwt.verify(token, SECRET, (err,result)=>{

        if(err){
          return res.status(403).json("forbidden");
        } else{
            next()
        }
    });
};
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

app.post("/articles/:id/comments",authentication, createNewComment);




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