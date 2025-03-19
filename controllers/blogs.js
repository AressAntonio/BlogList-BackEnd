const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

//EndPoint trayendo post del blog
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs =>{
        response.json(blogs) 
    })
});

//EndPoint trayendo post por ID
blogsRouter.get('/:id', (request, response, next) =>{

    Blog.findById(request.params.id)
        .then(blog =>{
            if(blog){
                response.json(blog)
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
});

//EndPoint delte post
blogsRouter.delete('/:id', (request, response, next) =>{
    Blog.findByIdAndDelete(request.params.id)
        .then(()=>{
            response.status(204).end()
        })
        .catch(error => next(error))
});

//EndPoint update post
blogsRouter.put('/:id', (request, response, next) =>{
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
    }

    Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        .then(updatedBlog =>{
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter;