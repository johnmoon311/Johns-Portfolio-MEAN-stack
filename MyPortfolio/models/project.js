var mongoose = require('mongoose');


var projectSchema = new mongoose.Schema({
	name: {}},
	date : {}},
	author : {}},
	image: {}},
	file: {}},
	language:{}},
	downloadCount: {},
	}
}, {collection: 'project'})

var project_model = mongoose.model('project', projectSchema);

module.exports = {"project_model":project_model};

//var dbPeople = mongoose.model('People', peopleSchema);

//var person = new dbPeople({name: 'John', age:'22', height:'6ft'});

//person.save();