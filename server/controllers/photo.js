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

exports.retrievePhotos = function (album_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            console.log('album_id cannot be null')
            reject();
        }
        else {
            let query = `
            SELECT object_id, file_path, title
            FROM snuaaa.tb_photo
            WHERE album_id = $1;
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

exports.createPhoto = function (_id, data) {
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
