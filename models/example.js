const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create the model as you normally would here
const exampleSchema = mongoose.Schema({
}, { timestamps: true });

module.exports = mongoose.model('Project', exampleSchema);