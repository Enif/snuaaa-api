const db = require('./connection')
import { createObject } from './object'

exports.retrieveComments = function(object_id) {
    return new Promise((resolve, reject) => {
        if(!object_id) {
            reject();
        }
        else {
            let query = `
                SELECT co.object_id, contents, ob.created_at, usr.nickname, usr.profile_path
                FROM snuaaa.tb_comment co
                INNER JOIN snuaaa.tb_object ob ON (co.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr._id)
                WHERE co.parent_id = $1
            `;
            db.any(query, object_id)
            .then(function(comments){
                console.log(comments)
                resolve(comments);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.createComment = function(_id, parent_id, data) {
    return new Promise((resolve, reject) => {
        if(!_id || !parent_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_comment(
            object_id, parent_id, contents) 
            VALUES ($<object_id>, $<parent_id>, $<contents>)`; 

        createObject(_id)
        .then((objectId) => {
            let queryData = {
                object_id: objectId,
                parent_id: parent_id,
                contents: data.contents
            };
            return db.any(query, queryData)            
        })            
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}