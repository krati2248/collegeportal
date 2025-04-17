const expres = require('express');
//console.log(expres);
const app = expres();
const port = 3000;
const web = require('./routes/web');
const connectDB = require('./database/db');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const strategy = require('passport-google-oauth20').Strategy;
require('./config/passport');
//get token of cookie
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    //tempFileDir:'/tmp/'

}))
//ejs setup
app.set('view engine', 'ejs');
//css image link static file
app.use(expres.static('public'));
//database connect
connectDB();
//data object key value
app.use(expres.urlencoded({ extended: false }));
// connect flash and session
const session = require('express-session')
const flash = require('connect-flash');

// messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    // res.set('Pragma', 'no-cache');
    // res.set("Expires", "0");
    next();
});

// Flash messages
app.use(flash());

//route load
app.use(web);


app.use(passport.initialize());
app.use(passport.session());

//routes
// expres.get('/', (req,res) =>
// {
//     res.send("home");
// })
// app.get('/about', (req,res) =>
// {
//     res.send("about");
// })

//server create
app.listen(port, () => {
    console.log(`server start localhost:${port}`);
})