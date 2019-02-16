const db = require('./connection')
import { createObject } from './object'

exports.retrieveAlbums = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT al.object_id, title, contents, ob.created_at, usr.nickname,
                (
                    SELECT ph.file_path
                    FROM snuaaa.tb_photo ph
                    INNER JOIN snuaaa.tb_object phobj ON (phobj.object_id = ph.object_id)
                    WHERE ph.album_id = al.object_id
                    ORDER BY phobj.created_at
                    LIMIT 1
				)
                FROM snuaaa.tb_album al
                INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr._id)
                WHERE al.board_id = $1
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
            SELECT al.object_id, title, contents
            FROM snuaaa.tb_album al
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

exports.createAlbum = function(_id, pbNo, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if(!_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa."tb_album"(
            "object_id", "title", "board_id", contents) 
            VALUES ($<object_id>, $<title>, $<board_id>, $<contents>)`; 

        createObject(_id)
        .then((objectId) => {
            let queryData = {
                object_id: objectId,
                title: data.title,
                board_id: pbNo,
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
