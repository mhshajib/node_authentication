var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://localhost:27017/passport');

//Init app
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set statuc folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(expressSession({
	secret: 'secret',
	saveUninitialized: true,
	resave:true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator

//TODO:Need to fix validation

// app.use(expressValidator({
// 	errorFormatter: function (param, msg, value) {
// 		var namespace = param.split('.')
// 			, root = namespace.shift()
// 			, formParam = root;
// 		while(namespace.length){
// 			formParam += '[' + namespace.shift() + ']';
// 		}
// 		return {
// 			param: formParam,
// 			msg: msg,
// 			value: value
// 		};
// 	}
// }));

//Connect flash
/* 

*/
app.use(connectFlash());

//Global vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.host = 'http://localhost:'+app.get('port');
	next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//Set Port
app.set('port',3300);

mongoose.connection.on('error', function(err) {
    console.log('Mongodb is not running.', err);
    process.exit();
}).on('connected', function() {
    app.listen(app.get('port'), function() {
        console.log('Server started at : http://localhost:' + app.get('port'));
    });
});