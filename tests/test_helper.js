const Blog = require('../models/blog');

const initialBlogs = [
    {
        title: 'Apertura del blog',
        author: 'aressantonio',
        url: 'https://www.github.com/aressantonio',
        likes: 2
    },
    {
        title: 'Segunda publicacion en blog',
        author: 'aressantonio',
        url: 'https://www.github.com/aressantonio',
        likes: 25
    },
];

const nonExistingId = async () =>{
    const blog = new Blog({title: 'willremovethissoon'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString();
};

const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map( blog => blog.toJSON())
};

module.exports = {
    initialBlogs, 
    nonExistingId,
    blogsInDb
}