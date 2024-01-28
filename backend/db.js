const mongoose = require('mongoose');

//Create a Schema for Users


mongoose.connect('mongodb+srv://abhinandansinghbaghel2001:abhinandan@cluster0.zonrd4d.mongodb.net/');

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


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User Model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});


// Create a model from the Schema

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Account,
}