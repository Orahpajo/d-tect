const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    email: String, 
    password: String,
    role: String
});

module.exports = mongoose.model('User', User);