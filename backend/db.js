const mongoose = require('mongoose');

//Create a Schema for Users


mongoose.connect('mongodb+srv://abhinandansinghbaghel2001:cYfhJfMRLe23S7Ln@cluster0.3fjqkhz.mongodb.net/new_Year_project');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// Create a model from the Schema

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}