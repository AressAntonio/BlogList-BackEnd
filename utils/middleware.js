const logger = require('./logger');

//middleware controlador de peticiones a endPoints en consola
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
};

//middleware controlador de solicitudes de endPoint desconocidos
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

//middleware controlador de errores
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    } else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
        return response.status(400).json({error: 'expected `ùsername` to be unique' });
    } else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error: 'token invalid' });
    } else if(error.name === 'TokenExpiredError'){
        return response.status(401).json({error: 'token expired' });
    }
  
    next(error)
};


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};