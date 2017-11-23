var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mySchema = new Schema({
	name : String,
	address: {},
	id : {
		type: Schema.ObjectId,
		ref: 'id'
	}
}, {collection: 'restaurants'});

mongoose.model('restaurants', mySchema);