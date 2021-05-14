const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

//Ticket #1
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

const getAllArticles = (req , res , next)=>{
    res.status(200);
    res.json(articles);
}

app.get('/articles' , getAllArticles);













app.listen(PORT, () => {
    console.log(`Project-3 app listening at http://localhost:${PORT}`);
  });