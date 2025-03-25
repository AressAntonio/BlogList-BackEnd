const {test, after, beforeEach} = require('node:test');
const Blog = require('../models/blog');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);


beforeEach(async () => {
    await Blog.deleteMany({})
   
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));

    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
    
});

test("blog are returned a json", async() =>{
    console.log('entered test');

    await api
        .get('/api/blogs')
        .expect(200)
        .expect('content-type', /application\/json/)
});

test('there are three titles', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});
  
test('the first title is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
  
    const title = response.body.map(e => e.title)
    assert(title.includes('Segunda publicacion en blog'));
});

test('a valid blog can be added', async () =>{

    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'aressantonio',
        url: 'https://www.github.com/aressantonio',
        likes: 100,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
   
    const contents = blogsAtEnd.map(n => n.title)

    assert(contents.includes('async/await simplifies making async calls'));
});

test('blog without content is not added', async () =>{
    const newBlog = {
        author: 'aressantonio'
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test('a specific blog can be viewed', async () =>{
    const blogAtStart = await helper.blogsInDb();

    const blogToView = blogAtStart[0];

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.deepStrictEqual(resultBlog.body, blogToView);
});

test('a blog can be deleted', async () =>{
    const blogAtStart = await helper.blogsInDb();
    const blogToDelete = blogAtStart[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb();

    const contents = blogsAtEnd.map(r => r.title);
    assert(!contents.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});



after(async() =>{
    await mongoose.connection.close();
});