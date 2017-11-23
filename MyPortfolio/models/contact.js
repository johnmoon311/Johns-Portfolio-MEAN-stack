var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contact_Schema = new Schema({
	name : String,
	company: String,
	email: String,
	phone: String,
	id : {
		type: Schema.ObjectId,
		ref: 'id'
	}

}, {collection: 'contact'});

var contact_model = mongoose.model('contact', contact_Schema);

module.exports = {"contact_model" : contact_model};