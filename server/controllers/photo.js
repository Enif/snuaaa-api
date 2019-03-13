const db = require('./connection')
import { createObject } from './object'

exports.retrievePhoto = function (photo_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            console.log('photo_id cannot be null')
            reject();
        }
        else {
            let query = `
            SELECT ph.object_id, ph.file_path, ph.title, usr.nickname, ob.created_at
            FROM snuaaa.tb_photo ph
            INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
            INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr._id)
            WHERE ph.object_id = $1;
        `;
            db.one(query, photo_id)
            .then(function (photo) {
                resolve(photo);
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
}

exports.retrievePhotosInAlbum = function (album_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            console.log('album_id cannot be null')
            reject();
        }
        else {
            let query = `
            SELECT ph.object_id, ph.file_path, ph.title
            FROM snuaaa.tb_photo ph
            INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
            WHERE ph.album_id = $1
            ORDER BY ob.created_at DESC
            ;
        `;
            db.any(query, album_id)
            .then(function (photos) {
                resolve(photos);
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
}

exports.retrievePhotosInBoard = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT ph.object_id, ph.file_path, ph.title
                FROM snuaaa.tb_photo ph
                INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
                LEFT OUTER JOIN snuaaa.tb_album al ON (ph.album_id = al.object_id)
                WHERE al.board_id = $1
                OR ph.board_id = $1
                ORDER BY ob.created_at DESC
                ;
            `;
            db.any(query, board_id)
            .then(function(photos){
                resolve(photos);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
}

exports.createPhotoInAlbum = function (_id, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if (!_id) {
            console.log('id can not be null')
            reject()
        }
        else {
            let query = `INSERT INTO snuaaa."tb_photo"(
                "object_id", "album_id", "file_path", "title") 
                VALUES ($<object_id>, $<album_id>, $<file_path>, $<title>)`;

            createObject(_id)
            .then((objectId) => {
                let queryData = {
                    object_id: objectId,
                    album_id: data.albumNo,
                    file_path: data.photoPath,
                    title: data.title,
                    // contents: data.contents
                };
                return db.any(query, queryData)
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        }
    })
}

exports.createPhotoInPhotoBoard = function (_id, pbNo, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if (!_id) {
            console.log('id can not be null')
            reject()
        }
        else {
            let query = `INSERT INTO snuaaa."tb_photo"(
                "object_id", "board_id", "file_path", "title") 
                VALUES ($<object_id>, $<board_id>, $<file_path>, $<title>)`;

            createObject(_id)
            .then((objectId) => {
                let queryData = {
                    object_id: objectId,
                    board_id: pbNo,
                    file_path: data.photoPath,
                    title: data.title,
                    // contents: data.contents
                };
                return db.any(query, queryData)
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                console.log(err)
                reject(err);
            });
        }
    })
}
