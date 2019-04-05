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
            SELECT ph.object_id, ph.file_path, ob.title, ob.created_at, usr.nickname, usr.profile_path, usr.introduction
            FROM snuaaa.tb_photo ph
            INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
            INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
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
            SELECT ph.object_id, ph.file_path, ob.title
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
                SELECT ph.object_id, ph.file_path, ob.title
                FROM snuaaa.tb_photo ph
                INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
                LEFT OUTER JOIN snuaaa.tb_album al ON (ph.album_id = al.object_id)
                LEFT OUTER JOIN snuaaa.tb_object alob ON (al.object_id = alob.object_id)
                WHERE alob.board_id = $1
                OR ob.board_id = $1
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

exports.createPhotoInAlbum = function (user_id, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if (!user_id) {
            console.log('id can not be null')
            reject()
        }
        else {
            data.type = 'PH';

            let query = `INSERT INTO snuaaa.tb_photo(
                object_id, album_id, file_path, date, location,
                camera, lens, focal_length, f_stop, exposure_time, iso)
                VALUES ($<object_id>, $<album_id>, $<file_path>, $<date>, $<location>,
                    $<camera>, $<lens>, $<focal_length>, $<f_stop>, $<exposure_time>, $<iso>)`;

            createObject(user_id, null, data)
            .then((objectId) => {
                let queryData = {
                    object_id: objectId,
                    album_id: data.album_id,
                    file_path: data.photoPath,
                    date: data.date,
                    location: data.location,
                    camera: data.camera,
                    lens: data.lens,
                    focal_length: data.focal_length,
                    f_stop: data.f_stop,
                    exposure_time: data.exposure_time,
                    iso: data.iso
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

exports.createPhotosInBoard = function (user_id, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if (!user_id) {
            console.log('id can not be null')
            reject()
        }
        else {
            data.type = 'PH';

            let query = `INSERT INTO snuaaa.tb_photo(
                object_id, file_path, date, location,
                camera, lens, focal_length, f_stop, exposure_time, iso)
                VALUES ($<object_id>, $<file_path>, $<date>, $<location>,
                    $<camera>, $<lens>, $<focal_length>, $<f_stop>, $<exposure_time>, $<iso>)`;

            createObject(user_id, data.board_id, data)
            .then((objectId) => {
                let queryData = {
                    object_id: objectId,
                    file_path: data.photoPath,
                    date: data.date,
                    location: data.location,
                    camera: data.camera,
                    lens: data.lens,
                    focal_length: data.focal_length,
                    f_stop: data.f_stop,
                    exposure_time: data.exposure_time,
                    iso: data.iso
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
