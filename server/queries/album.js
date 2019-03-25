const db = require('./connection')
import { createObject } from './object'

exports.retrieveAlbums = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT al.object_id, ob.category_id, ob.title, ob.contents, ob.created_at, usr.nickname, ctg.category_color,
                (
                    SELECT ph.file_path
                    FROM snuaaa.tb_photo ph
                    INNER JOIN snuaaa.tb_object phobj ON (phobj.object_id = ph.object_id)
                    WHERE ph.album_id = al.object_id
                    ORDER BY phobj.created_at DESC
                    LIMIT 1
				)
                FROM snuaaa.tb_album al
                INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                LEFT OUTER JOIN snuaaa.tb_category ctg ON (ob.category_id = ctg.category_id)
                WHERE ob.board_id = $1
            `;
            db.any(query, board_id)
            .then(function(albums){
                resolve(albums);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
};

exports.retrieveAlbumsbyCategory = function(board_id, category_id) {
    console.log('retrieve by category..')
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT al.object_id, ob.category_id, ob.title, ob.contents, ob.created_at, usr.nickname, ctg.category_color,
                (
                    SELECT ph.file_path
                    FROM snuaaa.tb_photo ph
                    INNER JOIN snuaaa.tb_object phobj ON (phobj.object_id = ph.object_id)
                    WHERE ph.album_id = al.object_id
                    ORDER BY phobj.created_at DESC
                    LIMIT 1
				)
                FROM snuaaa.tb_album al
                INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                LEFT OUTER JOIN snuaaa.tb_category ctg ON (ob.category_id = ctg.category_id)
                WHERE ob.board_id = $1
                AND ob.category_id = $2
            `;
            db.any(query, [board_id, category_id])
            .then(function(albums){
                resolve(albums);    
            })
            .catch((err) => {
                console.error(err)
                console.log(err)
                reject(err)
            })
        }
    })
};

exports.retrieveAlbum = function(album_id) {
    return new Promise((resolve, reject) => {
        if(!album_id) {
            reject();
        }
        else {
            let query = `
            SELECT al.object_id, ob.title, ob.contents
            FROM snuaaa.tb_album al
            INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
            WHERE al.object_id = $1
            `;
            db.one(query, album_id)
            .then(function(albumInfo) {
                resolve(albumInfo)
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
}

exports.createAlbum = function(user_id, board_id, data) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            console.error('id can not be null')
            reject()
        }
        data.type = 'AL';

        let query = `INSERT INTO snuaaa.tb_album(
            object_id) 
            VALUES ($<object_id>)`; 

        createObject(user_id, board_id, data)
        .then((object_id) => {
            let queryData = {
                object_id: object_id,
            };
            return db.any(query, queryData)            
        })            
        .then(() => {
            console.log('query success')
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}
