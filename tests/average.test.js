const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const average = require('../utils/for_testing').average

describe('average', () =>{

    test('of one value is the value itself', () =>{
        assert.strictEqual(average([1]), 1)
    });

    test('of many is calculated right', () =>{
        assert.strictEqual(average([1,2,3,4,5,6]), 3.5)
    });
    
    test('of empty array is zero', () =>{
        assert.strictEqual(average([]), 0)
    });


    test('dummy returns one', () => {
        const blogs = []
      
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    });

    test('when list has only one blog, equals the likes of that', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 0)
    })

});


