/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , StudentController = require('./studentController').StudentController;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var studentController= new StudentController('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
  studentController.findAll(function(error, stus){
      res.render('index', {
            title: 'Students Info',
            students:stus
        });
  });
});

//new student
app.get('/student/new', function(req, res) {
    res.render('student_new', {
        title: 'New Student'
    });
});

//save new student
app.post('/student/new', function(req, res){
    studentController.save({
        role: req.param('role'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an student
app.get('/student/:id/edit', function(req, res) {
	studentController.findById(req.param('_id'), function(error, student) {
		res.render('student_edit',
		{ 
			title: student.title,
			student: student
		});
	});
});

//save updated student
app.post('/student/:id/edit', function(req, res) {
	studentController.update(req.param('_id'),{
		role: req.param('role'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an student
app.post('/student/:id/delete', function(req, res) {
	studentController.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
