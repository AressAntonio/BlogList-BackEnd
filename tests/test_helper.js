const Blog = require('../models/blog');
const User = require('../models/user');

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
    const blog = new Blog({title: 'willremovethissoon', author: 'aressantonio', url: 'https://www.github.com/aressantonio', likes: 20})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString();
};

const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map( blog => blog.toJSON())
};

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, 
    nonExistingId,
    blogsInDb,
    usersInDb
}