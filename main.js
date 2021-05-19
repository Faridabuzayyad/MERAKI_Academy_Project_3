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

//Ticket #1    
const getAllArticles = (req , res , next)=>{
    const err = new Error("No Articles Found");
    err.status = 404;
    if(articles.length === 0){
        next(err)
    }
    else{
        res.status(200).json(articles);
    }
}

app.get('/articles', getAllArticles);


//Ticket #2
const getArticlesByAuthor = async (req, res, next) =>{
    const reqAuthor = req.query.author;
    const err = new Error("No Articles for this Author");
    err.status = 404;
    const arrOfArticles= await articles.filter((element) =>{
        return element.author === reqAuthor;
    });
    if(arrOfArticles.length > 0){
        res.status(200).json(arrOfArticles);
    }
    else{
        next(err);
    }
    
}

app.get('/articles/search_1', getArticlesByAuthor);


//Ticket #3
const getAnArticleById = async (req, res, next) =>{
    const reqId = req.query.id;
    const reqArticle = await articles.find((element) =>{
        return element.id == reqId;
    })
    const err = new Error("No Articles with this id");
    err.status = 404;
    if(reqArticle){
        res.status(200).json(reqArticle);
    }
    else{
        next(err);
    }
}

app.get('/articles/search_2', getAnArticleById);

//Ticket #4
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


//Ticket #5 
const updateAnArticleById = async (req , res , next) => {
    const id = req.params.id;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const newAuthor = req.body.author;
    const err = new Error("You need to enter an existing Article ID");
    err.status = 404;
    let index;
    await articles.forEach((element, i) => {
        if(element.id == id){
            index = i;
        }
    });
    if(index < articles.length && newTitle.length >= 2 && newDescription.length >= 10 && newAuthor.length >= 2){
        articles[index] = {title :`${newTitle}` , description : `${newDescription}`, author : `${newAuthor}`, id : `${id}`};
        res.status(200).json(articles[index]);
    }
    else{
        next(err);
    };
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