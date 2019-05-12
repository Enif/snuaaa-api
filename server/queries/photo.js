const db = require('./connection');
import { createObject } from './object';
import { createObjectTag } from './tag';

exports.retrievePhoto = function (photo_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            console.log('photo_id cannot be null')
            reject();
        }
        else {
            let query = `
            SELECT ph.object_id, ph.file_path, ph.date, ph.location, ph.camera, ph.lens,
            ph.exposure_time, ph.focal_length, ph.f_stop, ph.iso,
            ob.title, ob.contents, ob.author_id, ob.created_at, ob.like_num, ob.comment_num,
            usr.nickname, usr.profile_path, usr.introduction
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

exports.updatePhoto = function(photo_id, photoData) {
    return new Promise((resolve, reject) => {

        if(!photo_id) {
            reject('id can not be null')
        }

        let query = `
            UPDATE snuaaa.tb_photo
            SET date=$<date>,
            location=$<location>,
            camera=$<camera>,
            lens=$<lens>,
            focal_length=$<focal_length>,
            f_stop=$<f_stop>,
            exposure_time=$<exposure_time>,
            iso=$<iso>
            WHERE object_id=$<object_id>;
        `;

        let queryData = {
            object_id: photo_id,
            date: photoData.date,
            location: photoData.location,
            camera: photoData.camera,
            lens: photoData.lens,
            focal_length: photoData.focal_length,
            f_stop: photoData.f_stop,
            exposure_time: photoData.exposure_time,
            iso: photoData.iso
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


exports.deletePhoto = function(photo_id) {
    return new Promise((resolve, reject) => {

        if(!photo_id) {
            reject('id can not be null')
        }

        let query = `
            DELETE FROM snuaaa.tb_photo
            WHERE object_id = $1;
        `;

        db.none(query, photo_id)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
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
            SELECT ph.object_id, ph.file_path, ob.title, ob.like_num, ob.comment_num
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
                SELECT ph.object_id, ph.file_path, ob.title, ob.like_num, ob.comment_num
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

            createObject(user_id, data.board_id, data)
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
                return Promise.all([db.any(query, queryData)]
                .concat(data.tags.map((tag => createObjectTag(objectId, tag)))))
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
                return Promise.all([db.any(query, queryData)]
                .concat(data.tags.map((tag => createObjectTag(objectId, tag)))))
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


exports.retrievePhotosByUser = function(user_id) {
    return new Promise((resolve, reject) => {
        if(!user_id) {
            reject();
        }
        else {
            let query = `
                SELECT ph.object_id, ph.file_path, ob.title, ob.like_num, ob.comment_num
                FROM snuaaa.tb_photo ph
                INNER JOIN snuaaa.tb_object ob ON (ph.object_id = ob.object_id)
                INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
                WHERE usr.user_id = $1
                ORDER BY ob.created_at DESC
                LIMIT 4
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

exports.retrievePhotosByTag = function(tags) {
    return new Promise((resolve, reject) => {
        if(!tags) {
            reject();
        }
        else {
            let query = `
                SELECT DISTINCT ob.object_id, ob.title, ob.like_num, ob.comment_num, ob.created_at, ph.file_path
                FROM snuaaa.tb_object ob
                INNER JOIN snuaaa.tb_object_tag obt ON (ob.object_id = obt.object_id)
                INNER JOIN snuaaa.tb_photo ph ON (ob.object_id = ph.object_id)
                WHERE obt.tag_id IN ($1:list)
                ORDER BY ob.created_at DESC
            ;`;

            db.any(query, [tags])
            .then(function(photos){
                resolve(photos);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
}

