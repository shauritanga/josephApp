const express = require('express');
const tractors = require('./tractors');
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

//Landing page
app.get('/', (req, res) => {
    res.render('index',{
        title: 'Atthanas'
    })
});


//Search route
app.get('/search', (req,res) => {
    const post = tractors.filter(tractor => {
        return tractor.type === req.query.q.toLowerCase()
    });
    res.render('posts',{
        title: 'Tractors Available',
        posts: post
    });
});

app.listen(port, console.log(`Server is running on port ${port}`))