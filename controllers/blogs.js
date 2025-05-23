/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
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

//EndPoint update likes of posts
blogsRouter.put('/:id/likes', async (request, response) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { $inc: { likes: 1 } }, // Incrementa en 1 sin necesidad de enviar el valor actual
        { new: true }
      );
      response.status(200).json(updatedBlog);
    } catch(error){
      response.status(500).json({error});
    }
});


//usando jwt para creacion de nuevos blogs segun usuario
const getTokenFrom = request => {
    const authorization = request.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')){
        
        return authorization.replace('Bearer ', '')
    }

    return null;
};

//EndPoint create new post

blogsRouter.post('/', async (request, response) =>{

    const body = request.body;

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id){
        return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });


    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog);

});

//EndPoint delte post
blogsRouter.delete('/:id', async (request, response) =>{


    try {
      // 1. Verificar token
      const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
      if (!decodedToken.id) return response.status(401).json({ error: 'Token inválido' });
  
      // 2. Buscar usuario y blog
      const user = await User.findById(decodedToken.id);
      const blog = await Blog.findById(request.params.id);
  
      if (!blog) return response.status(404).json({ error: 'Blog no encontrado' });
  
      // 3. Comparar IDs (convertir a String para comparación segura)
      if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'No tienes permiso para eliminar este post' });
      }
  
      // 4. Eliminar blog
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).json('se a eliminado el post').end();
  
    } catch (error) {
      console.log(error.name)
      response.status(500).json({ error: 'Error interno del servidor' });
    }

});

//EndPoint update post content
blogsRouter.put('/:id', async (request, response) =>{
  /*try{
    const body = request.body;
    

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id){
        return response.status(401).json({error: 'token invalid'})
    }
    
    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(request.params.id);

    if (!blog) return response.status(404).json({ error: 'Post no encontrado' });
    
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }

     const UpdatePost = await Blog.findByIdAndUpdate(request.params.id, {title: body.title}, {new: true});
     
     response.status(201).json(UpdatePost).end();

  

  }catch (error){
    response.status(500).json({error});
  };*/
   
  try {
    const { id } = request.params;
    const { title } = request.body;

    // Verificar token
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token inválido o faltante' });
    }

    // Buscar el post y el usuario
    const blog = await Blog.findById(id);
    const user = await User.findById(decodedToken.id);

    // Validaciones
    if (!blog) return response.status(404).json({ error: 'Post no encontrado' });
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'No tienes permiso para editar este post' });
    }

    // Actualizar con validaciones de esquema
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { 
        title: title || blog.title // Mantiene el valor actual si no se envía nuevo 
      },
      { 
        new: true,
        runValidators: true, // Aplica validaciones del schema
        context: 'query' 
      }
    );

    response.status(200).json(updatedBlog);

  } catch (error) {
    console.error(error);
    
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
    
    response.status(500).json({ 
      error: 'Error al actualizar el post',
      details: error.message 
    });
  }

})

module.exports = blogsRouter;