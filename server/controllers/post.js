const db = require('./connection')
import { createObject } from './object'

exports.retrievePosts = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT po.object_id, title, contents, ob.created_at, usr.nickname
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr._id)
                WHERE po.board_id = $1
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
                SELECT title, contents, ob.created_at, usr.nickname
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr._id)
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
            SELECT title, contents, ob.created_at
            FROM snuaaa.tb_post po
            INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
            WHERE po.board_id = 'b00'
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

exports.createPost = function(_id, data) {
    return new Promise((resolve, reject) => {
        console.log(_id)
        console.log(data)

        if(!_id) {
            console.log('id can not be null')
            reject()
        }
        if(!data.categoryNo) {
            data.categoryNo = 0;
        }
        
        let query = `INSERT INTO snuaaa."tb_post"(
            "object_id", "title", "board_id", category_no, contents) 
            VALUES ($<object_id>, $<title>, $<board_id>, 
                $<category_no>, $<contents>)`; 

        createObject(_id)
        .then((objectId) => {
            let queryData = {
                object_id: objectId,
                title: data.title,
                board_id: data.boardNo,
                category_no: data.categoryNo,
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