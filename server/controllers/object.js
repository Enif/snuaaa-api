const db = require('./connection')


exports.createObject = function(id) {
    const TAG = 'createObject'

    return new Promise((resolve, reject) => {
        
        if(!id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa."tb_object"(
            "author_id", "created_at") 
            VALUES ($<id>, $<created>)
            RETURNING "object_id"`; 

        let created = new Date()
        
        let queryData = {
            id: id,
            created: created
        };
            
        db.one(query, queryData, object => object.object_id)
        .then((object_id) => {
            console.log(`[${TAG}] object >> ${object_id}`)
            resolve(object_id);
        })
        .catch((err) => {
            reject(err);
        });
    })   
}