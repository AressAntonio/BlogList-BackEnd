const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    name: {
        type: String,
        minLength: 3
    },
    passwordHash: {
        type: String,
        minLength: 8,
        required: true
    },
    blogs: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
       }
    ],
});

//Oculta ID UNICO DE CADA OBJETO, CONTROL DE VERSIONES DE MONGO.DB y password creado por el user 
userSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;