const express = require("express");
const { uuid } = require('uuidv4');
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
    const err = new Error("No Articles Available");
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
    const arrOfArticles= await articles.filter((element) =>{
        return element.author === reqAuthor;
    });
    const err = new Error("No Articles for this Author");
    err.status = 404;
    if(arrOfArticles.length == 0){
        next(err);
    }
    else{
        res.status(200).json(arrOfArticles);
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
const createNewArticle = (req, res, next) =>{
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;
    const err = new Error("You need A title with length 3 or more chars , A descripton with length 10 or more chars , An author name with 3 or more chars");
    err.status = 406;
    if(title.length >= 3 && description.length >= 10 && author.length >= 3){
        let id = uuid();
        const newArticle = {title :`${title}` , description : `${description}`, author : `${author}`, id : `${id}`};
        articles.push(newArticle);
        res.status(201).json(newArticle);
    }
    else{
        next(err);
    }
    

}

app.post('/articles' , createNewArticle);


//ticket #5 


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