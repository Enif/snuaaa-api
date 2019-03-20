const db = require('./connection')


exports.createObject = function(user_id, board_id, data) {
    const TAG = 'createObject'

    return new Promise((resolve, reject) => {
        
        if(!user_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_object(
            author_id, category_id, board_id, type, title, contents, created_at) 
            VALUES ($<user_id>, $<category_id>, $<board_id>, $<type>, $<title>, $<contents>, $<created>)
            RETURNING object_id`; 

        let created = new Date()
        
        let queryData = {
            user_id: user_id,
            category_id: data.category_id,
            board_id: board_id,
            type: data.type,
            title: data.title,
            contents: data.contents,
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