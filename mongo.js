/* eslint-disable no-undef */
const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as argument');
    process.exit(1);
};

const password = process.argv[2];
const name = process.argv[3];

const url = `mongodb+srv://aressgarrido:${password}@cluster0.rk8zc.mongodb.net/bloglist?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
});

//ELEMINANDO ID UNICO DE CADA OBJETO Y CONTROL DE VERSIONES DE MONGO.DB
blogSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
});



const Blog = mongoose.model('Blog', blogSchema);

//crear nota
/*const blog = new Blog({
    title: 'Apertura del blog',
    author: 'aressantonio',
    url: 'https://www.github.com/aressantonio',
});*/

//crear post
/*blog.save().then(()=>{
    console.log('note saved!');
    mongoose.connection.close();
});*/

if(process.argv.length === 2){
    
    Blog.find({}).then(result =>{
        result.forEach(blog =>{
            console.log(blog);
        })
        mongoose.connection.close();
    });
    
} else if(process.argv.length === 3){
    //EndPoint busqueda especifica por nombre
    Blog.find({author: name}).then(result =>{
    result.forEach(blog =>{
        console.log(blog);
    })
    mongoose.connection.close();
    });
}


