const db = require('./connection')
import { createObject, deleteObject } from './object'

exports.retrievePostCount = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT COUNT(*)
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                WHERE ob.board_id = $1
            `;
            db.one(query, board_id)
            .then(function(postNum){
                resolve(postNum);    
            })
            .catch((err) => {
                reject(err)
            })
        }   
    })
}

exports.retrievePosts = function(board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT po.object_id, ob.author_id, ob.title, ob.contents, ob.created_at, ob.like_num, ob.comment_num, usr.nickname
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                WHERE ob.board_id = $1
                ORDER BY ob.created_at DESC
                LIMIT $2
                OFFSET $3
            `;
            db.any(query, [board_id, rowNum, offset])
            .then(function(posts){
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
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT ob.title, ob.author_id, ob.contents, ob.created_at, ob.like_num, ob.comment_num, ob.board_id,
                usr.nickname, usr.profile_path, usr.introduction
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                WHERE ob.object_id = $1
            `;
            db.one(query, object_id)
            .then(function(post) {
                resolve(post);
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.retrievePostsByUser = function(user_id) {
    return new Promise((resolve, reject) => {
        if(!user_id) {
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT po.object_id, ob.title, ob.contents, ob.created_at, brd.board_name
                FROM snuaaa.tb_post po
                INNER JOIN snuaaa.tb_object ob ON (po.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                INNER JOIN snuaaa.tb_board brd ON (ob.board_id = brd.board_id)
                WHERE usr.user_id = $1
                ORDER BY ob.created_at DESC
                LIMIT 5
            `;
            db.any(query, user_id)
            .then(function(posts){
                resolve(posts);    
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
            WHERE ob.board_id = 'brd01'
            ORDER BY ob.created_at DESC
            LIMIT 1
        `;
        db.one(query, [true])
        .then(function(post) {
            resolve(post);
        })
        .catch((err) => {
            reject(err)
        })
        
    })
}

exports.createPost = function(user_id, board_id, data) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            reject('id can not be null')
        }
        data.type = 'PO';
        
        let query = `INSERT INTO snuaaa.tb_post(
            object_id) 
            VALUES ($<object_id>)`; 

        createObject(user_id, board_id, data)
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

exports.updatePost = function(post_id, postData) {
    return new Promise((resolve, reject) => {

        if(!post_id) {
            reject('id can not be null')
        }

        let query = `
            UPDATE snuaaa.tb_object
            SET title=$<title>,
            contents=$<contents>
            WHERE object_id=$<post_id>;
        `;

        let queryData = {
            post_id: post_id,
            title: postData.title,
            contents: postData.contents
        }

        db.any(query, queryData)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.deletePost = function(post_id) {
    return new Promise((resolve, reject) => {

        if(!post_id) {
            reject('id can not be null')
        }

        let query = `
            DELETE FROM snuaaa.tb_post
            WHERE object_id = $1;
        `;

        db.none(query, post_id)
        .then(() => {
            return deleteObject(post_id)
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}