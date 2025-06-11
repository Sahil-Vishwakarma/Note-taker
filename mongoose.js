const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = mongoose.Schema({
    title: String,
    details: String 
});

module.exports = mongoose.model('User', userSchema);