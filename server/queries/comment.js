const db = require('./connection')
import { createObject } from './object'

exports.retrieveComments = function(object_id) {
    return new Promise((resolve, reject) => {
        if(!object_id) {
            reject();
        }
        else {
            let query = `
                SELECT co.comment_id, co.contents, co.created_at, usr.nickname, usr.profile_path
                FROM snuaaa.tb_comment co
                INNER JOIN snuaaa.tb_user usr ON (co.author_id = usr.user_id)
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

exports.createComment = function(user_id, parent_id, data) {
    return new Promise((resolve, reject) => {
        if(!user_id || !parent_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_comment(
            author_id, parent_id, contents, created_at) 
            VALUES ($<user_id>, $<parent_id>, $<contents>, $<created_at>)`; 

        let created = new Date()

        let queryData = {
            user_id: user_id,
            parent_id: parent_id,
            contents: data.contents,
            created_at: created
        }
            
        db.any(query, queryData)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}


exports.retrieveCommentsByUser = function(user_id) {
    return new Promise((resolve, reject) => {
        if(!user_id) {
            reject();
        }
        else {
            let query = `
                SELECT co.comment_id, co.parent_id, co.contents, co.created_at,
                ob.title, ob.type, brd.board_name
                FROM snuaaa.tb_comment co
                INNER JOIN snuaaa.tb_object ob ON (co.parent_id = ob.object_id)
                INNER JOIN snuaaa.tb_board brd ON (ob.board_id = brd.board_id)
                WHERE co.author_id = $1
                ORDER BY co.created_at DESC
                LIMIT 6
            ;`;

            db.any(query, user_id)
            .then(function(photos){
                resolve(photos);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};