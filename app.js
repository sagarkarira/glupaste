var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express(); 


var port = 5000;

var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(express.static('public'));

app.set('views','./src/views');
app.set('view engine','ejs');	

app.get('/', function(req,res){
	res.render('index', { title: 'glupaste' });
	// res.sendFile(__dirname + '/src/views/test.html');
});

app.get('/:id', function(req,res){
	var path = __dirname + "/files/" + req.params.id + '.txt';
	fs.readFile(path, 'utf8', function (err,data) {
  		if (err) {
    		res.render('nopaste');
  		}else{


	  		var metadata = JSON.parse(data);
	  		var author = metadata.author;
	  		var language = metadata['language'];
	  		var content = metadata['content'];
	  		var timestamp =  metadata.timestamp;
	  		var date = metadata.date;

	  		res.render('paste',{
	  			author: author,
	  			language: language,
	  			content: content,
	  			timestamp : timestamp,
	  			date : date
			});
		}		
	});
});


app.post('/', urlencodedParser , function(req,res){
	
	var author = req.body.poster;	
	var language = req.body.syntax;	
	var content = req.body.content;
	var timestamp = Date.now().toString().substring(6);
	var date = Date();
	

	var metadata = {

		author : author,
		language : language,
		content : content,
		timestamp : timestamp,
		date : date
	};
	var path = __dirname + "/files/" + timestamp+ '.txt';

	fs.writeFile(path, JSON.stringify(metadata,null,4), function (err) {
  		if (err) return console.log(err);
  			res.redirect('/' + timestamp);
  	});
	console.log('File saved-' + timestamp+'.txt');

});

app.get('*', function(req, res){
  res.render('error');
});


app.listen(port , function(err)	{
	console.log('running server on port:'+ port);

}); 	
