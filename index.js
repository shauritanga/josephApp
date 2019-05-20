const express = require('express');
const session = require('express-session')
const tractors = require('./tractors');
const admin = require('./admin')

const app = express()
const port = process.env.PORT || 3000;


// CONFIG SESSION
app.use(session({
    secret: 'Shauritanga loves you all',
    resave: false,
    saveUninitialized: false
}));

// make user available to all template
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
})
app.use(express.urlencoded({extended: true}))
app.use(express.json())



app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')



//Landing page
app.get('/', (req, res) => {
    res.render('index',{
        title: 'JoseFredy | Home'
    })
});
app.get('/admin', (req, res) => {
    if(req.session.userID) {
        return res.render('admin', {
            title: 'Administration'
        })
    }
    return res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

app.post('/login', (req, res) => {
    if(!req.body.email && !req.body.password) {
        return;
    } else {
        let user = admin.filter(user => {
            return user.email === req.body.email;
        });
        const { password } = user[0];
        if(password === req.body.password) {
            req.session.userID = user[0];
            res.redirect('/admin')
        } else{
            res.redirect('/login')
        }
    }
})


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
