//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License"). 
//You may not use this file except in compliance with the License. 
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed 
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
//either express or implied. See the License for the specific language 
//governing permissions and limitations under the License.

//Get modules.
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname + '/views'));
app.set('models', path.join(__dirname + '/models'));
app.locals.delimiters = '<% %>';
app.set('view engine', 'hjs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//GET home page.
app.use('/', routes);

//POST signup form.


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
