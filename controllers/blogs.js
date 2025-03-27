const blogsRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

//EndPoint trayendo post del blog
blogsRouter.get('/', async (request, response) => {
    
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.status(200).json(blogs);
    
});

//EndPoint trayendo post por ID
blogsRouter.get('/:id', async (request, response ) =>{

    const blog = await Blog.findById(request.params.id);

    if(blog){

      response.status(200).json(blog);

    }else{

      response.status(404).end();
    }
    
});

//EndPoint delte post
blogsRouter.delete('/:id', async (request, response) =>{
    
   await Blog.findByIdAndDelete(request.params.id);
   response.status(204).end();

});

//EndPoint update post
blogsRouter.put('/:id', async (request, response) =>{
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlogs = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true});
    response.status(200).json(updatedBlogs);

    
});

//EndPoint create new post

blogsRouter.post('/', async (request, response) =>{

    const body = request.body;

    const user = await User.findById(body.userId);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    });


    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog);

});

module.exports = blogsRouter;