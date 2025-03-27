const {test, after, beforeEach, describe} = require('node:test');
const Blog = require('../models/blog');
const User = require('../models/user');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const bcrypt = require('bcrypt')
const app = require('../app');

const api = supertest(app);

describe('when there is initially some blogs saved', () =>{
   
    beforeEach(async () => {

        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
        /*const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    
        const promiseArray = blogObjects.map(blog => blog.save());
        await Promise.all(promiseArray);*/
        
    });

    test("blog are returned a json", async() =>{
        console.log('entered test');
    
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('content-type', /application\/json/)
    });

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
      
        const title = response.body.map(e => e.title)
        assert(title.includes('Segunda publicacion en blog'));
    });

    describe('viewing a specific blog', () =>{

        test('succeeds with a valid id', async () =>{
            const blogAtStart = await helper.blogsInDb();
        
            const blogToView = blogAtStart[0];
        
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            assert.deepStrictEqual(resultBlog.body, blogToView);
        });

        test('fails with statuscode 404 if blog does not exits', async () =>{
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        });

        test('fails with statuscode 400 id is invalid', async () =>{
            const invalidId = '5a3d5da59070081a82a3445';

            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        });

        describe('addition of a new blog', () =>{

            test('succeds with valid data', async () =>{

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

            test('fails with status code 400 if data invalid', async () =>{
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
        });

        describe('deletion of a blog', () =>{

            test('succeeds with status code 204 if id is valid', async () =>{
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

        })

        describe('update of a blog', () =>{

            test('succeds updata of a blog', async () =>{
                const blogAtStart = await helper.blogsInDb();
                const blogToUpdate = blogAtStart[0];

                const newBlog = {
                    title: 'async/await simplifies making async calls',
                    author: 'aressantonio',
                    url: 'https://www.github.com/aressantonio',
                    likes: 100,
                };
            
                await api
                    .put(`/api/blogs/${blogToUpdate.id}`)
                    .send(newBlog)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
                
                const blogsAtEnd = await helper.blogsInDb()
                assert(blogsAtEnd.length, helper.initialBlogs.length + 1)
               
                const contents = blogsAtEnd.map(n => n.title)
            
                assert(contents.includes('async/await simplifies making async calls'));
            });

        })

    })

    

})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
  
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async() =>{
    await mongoose.connection.close();
});







  












