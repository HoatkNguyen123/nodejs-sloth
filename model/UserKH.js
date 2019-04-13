var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = new Schema({
 fullname 		: String,
 img 			: String,
 email 			: String,
 password 		: String,

},{collection : 'userKH'});

module.exports = mongoose.model('UserKH', User);