var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./app_config.json');
var docClient = new AWS.DynamoDB.DocumentClient();
var config = require("../app_config.js");
var util = require("util");

var table_name = "MyProjects";


router.get('/', function(req, res, next) {
	res.render('index', { 'title':'Home', partials : { layout : 'layout'}});
});

router.get('/resume', function(req, res, next){
	res.render('resume', { 'title':'Resume', partials : { layout : 'layout'}});
});

router.get('/contact', function(req, res){
	res.render('contact', { 'title':'Contact', partials : { layout : 'layout'}});
});

router.get('/about', function(req, res){
	res.render('about', { 'title': 'About', partials : { layout : 'layout'}});
})

router.get('/projects', function(req, res, next){
	res.render('projects', { 'title':'Projects', partials : { layout : 'layout'}});

});
router.get('/pacman_details', function(req, res, next){
	res.render('pacman_detail', { 'title':'Projects', partials : { layout : 'layout'}})
})
router.get('/pvp_detail', function(req, res, next){
	res.render('pvp_detail', { 'title':'Projects', partials : { layout : 'layout'}})
})
router.get('/none', function(req, res, next){
	res.render('none', { 'title':'Projects', partials : { layout : 'layout'}})
})


router.get('/admin0311', function(req, res){
	docClient.scan({"TableName":table_name}, function(err, result){
		if(err){
			console.log(err);
		}
		if(result)
			res.render('admin', { project : result.Items, partials : { layout : 'layout'}});
		else
			res.render('admin', { project : {}, partials : { layout : 'layout'}});
	});
})

router.get('/GetProjects', function(req, res){
	docClient.scan({"TableName":table_name}, function(err, result){
		if(result)
			res.json({"my_project" : result.Items});
		else
			res.json({"my_project" : {}});
	});
})

router.post('/addcount', function(req, res){
	var project = {
		TableName : table_name,
		Key:{
			"id":req.body.id
		},
	}
	project["UpdateExpression"] = "set project_downloadCount=:c";
    project["ExpressionAttributeValues"]={
		":c" : req.body.count
    };
	project["ReturnValues"]="UPDATED_NEW";
	console.log('were updaing!');
	docClient.update(project, function(err, project){
		if(err){
			console.log(err);
			res.json("fail");
		}
		else
			res.json("success");
	});
});
router.post('/addproject', function(req, res){
	var new_languages = req.body.project_language;
	if(new_languages.indexOf('all') == -1){
		new_languages = "all," + new_languages;
	}
	var name = req.body.project_name.replace(/\s+/g, '');
	var item = {"id":name,
		"project_name": req.body.project_name,
		"project_date":req.body.project_date, 
		"project_author" :req.body.project_author, 
		"project_image":req.body.project_image,
		"project_file":req.body.project_file,
		"project_downloadCount":parseInt(req.body.project_downloadCount),
		"project_language" : new_languages,
		"project_detail" : req.body.project_detail
	};
	var new_project = {
		"TableName" : table_name,
		"Item": item
	};
	docClient.put(new_project, function(err, data) {
	if (err) {
    	console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	} else {
    	res.redirect('admin0311');

	}

	});
	
});
router.post('/updateproject', function(req, res){

	var project = {
		TableName : table_name,
		Key:{
			"id":req.body.id
		},
	}
	if(req.body.action == "update"){
		var new_languages = req.body.project_language;
		if(new_languages.indexOf('all') == -1){
			new_languages = "all," + new_languages;
		}

		project["UpdateExpression"] = "set project_author=:a, project_image=:i, project_file=:f, project_downloadCount=:c, project_language=:l, project_date=:d, project_name=:n, project_detail=:q";
    	project["ExpressionAttributeValues"]={
	    	":n":req.body.project_name,
	        ":d":req.body.project_date, 
			":a" :req.body.project_author, 
			":i":req.body.project_image,
			":f":req.body.project_file,
			":c":parseInt(req.body.project_downloadCount),
			":l" : new_languages,
			":q" : req.body.project_detail
	    	};
    	project["ReturnValues"]="UPDATED_NEW";


		console.log('were updaing!');
		docClient.update(project, function(err, data){
			if(err){
				console.log(err);
			}
		});
	}

	else if(req.body.action == "delete"){
		docClient.delete(project, function(err, data){
			if(err){
				console.log(err);
			}
			
		})
	}
	res.redirect('/admin0311');



})

router.post('/sendEmail', function(req, res){
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail', // loads nodemailer-ses-transport
    auth:{
      user: config.email.username,
      pass: config.email.password
    }
	}));

	var mailOptions = {
	    from: "\"" + req.body.name + "\" <" + req.body.email + ">", // sender address
	    to: ["jonmoon93@gmail.com", config.email.username], // list of receivers
	    subject: "Question from " + req.body.company, // Subject line
	    text: util.format("From: %s,\n%s",req.body.email, req.body.question)// plaintext body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        res.render('error');
	    }
	    console.log('Message sent: ' + info.response);
	    res.render('contact', { 'title':'Contact', 'success':true, partials : { layout : 'layout'}});
	});
});


module.exports = router;
