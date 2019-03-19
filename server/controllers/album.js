const db = require('./connection')
import { createObject } from './object'

exports.retrieveAlbums = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT al.object_id, ob.title, ob.contents, ob.created_at, usr.nickname,
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

exports.createAlbum = function(id, board_id, data) {
    return new Promise((resolve, reject) => {
        console.log(board_id)
        console.log(data)

        if(!id) {
            console.log('id can not be null')
            reject()
        }
        data.type = 'AL';

        let query = `INSERT INTO snuaaa.tb_album(
            object_id) 
            VALUES ($<object_id>)`; 

        createObject(id, board_id, data)
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
