//prueba de testing unitaria

const dummy = (blogs) => {
    
    return blogs, 1;
}

const totalLikes = (blogs) =>{

    const reducer = (sum, item) =>{
        return sum + item
    }

    return blogs.length === 0 
        ? 0
        : blogs.reduce(reducer, 0) / blogs.length;
}
  
module.exports = {
    dummy,
    totalLikes,
}