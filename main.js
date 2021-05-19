const express = require("express");
const { uuid } = require('uuidv4');
const {UserModel, ArticleModel} = require("./schema");
const db = require("./db");
const app = express();
const PORT = 5000;

app.use(express.json());

const articles = [
    {
        id: 1,
        title: 'How I learn coding?',
        description:
        'Lorem, Quam, mollitia.',
        author: 'Jouza',
        },
        {
        id: 2,
        title: 'Coding Best Practices',
        description:
        'Lorem, ipsum dolor sit, Quam, mollitia.',
        author: 'Besslan',
        },
        {
        id: 3,
        title: 'Debugging',
        description:
        'Lorem, Quam, mollitia.',
        author: 'Jouza',
        },
    ];

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
        res.json(updatedArticle);
    } catch (err) {
        console.log(err);
    }
};

app.put('/articles/:id' , updateAnArticleById);

//Ticket #6
const deleteArticleById = (req, res, next) =>{
    const id = req.params.id;
    const err = new Error("No Articles with this id found");
    err.status = 404;
    articles.forEach((element, i) => {
        if(element.id == id){
            articles.splice(i,1);
            const delObject = {"success": true , "message" : `Successfully deleted article with id => ${id}`}
            res.status(200).json(delObject);
        }
        else{
            next(err);
        };
    });
}

app.delete("/articles/:id", deleteArticleById);

//Ticket #7
const deleteArticlesByAuthor = (req, res, next) =>{
    const author = req.body.author;
    const oldLength = articles.length;
    const err = new Error("No Articles found for this Author, please check the name you are entering");
    err.status = 404;
    articles.forEach((element,index) => {
        if(element.author === author){
            articles.splice(index, 1)
        }
    })
    const newLength = articles.length;
    if(oldLength == newLength){
        next(err);
    }
    else{
        const delObject = {"success": true , "message" : `Successfully deleted all articles for the author => ${author}`}
        res.status(200).json(delObject);
    }
}

app.delete("/articles", deleteArticlesByAuthor);



//Tickest 1-B
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



//Error Handler
app.use((err , req , res , next)=>{
    res.status(err.status);
    res.json({
            error : {
            status : err.status,
            message : err.message,
        },
});
});

app.listen(PORT, () => {
    console.log(`Project-3 app listening at http://localhost:${PORT}`);
  });