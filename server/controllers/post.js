const db = require('./connection')
import { createObject } from './object'

exports.retrievePosts = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT po.object_id, ob.title, ob.contents, ob.created_at, usr.nickname
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                WHERE ob.board_id = $1
            `;
            db.any(query, board_id)
            .then(function(posts){
                console.log(posts)
                resolve(posts);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.retrievePost = function(object_id) {
    return new Promise((resolve, reject) => {
        if(!object_id) {
            reject();
        }
        else {
            let query = `
                SELECT ob.title, ob.contents, ob.created_at, usr.nickname
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                WHERE ob.object_id = $1
            `;
            db.one(query, object_id)
            .then(function(post) {
                console.log(post)
                resolve(post);
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.retrieveSoundBox = function() {
    return new Promise((resolve, reject) => {

        let query = `
            SELECT ob.title, ob.contents, ob.created_at
            FROM snuaaa.tb_post po
            INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
            WHERE ob.board_id = 'b00'
            ORDER BY ob.created_at DESC
            LIMIT 1
        `;
        db.one(query, [true])
        .then(function(post) {
            console.log(post)
            resolve(post);
        })
        .catch((err) => {
            reject(err)
        })
        
    })
}

exports.createPost = function(id, board_id, data) {
    return new Promise((resolve, reject) => {

        if(!id) {
            console.log('id can not be null')
            reject()
        }
        data.type = 'PO';
        
        let query = `INSERT INTO snuaaa.tb_post(
            object_id) 
            VALUES ($<object_id>)`; 

        createObject(id, board_id, data)
        .then((objectId) => {
            let queryData = {
                object_id: objectId
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