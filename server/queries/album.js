const db = require('./connection')
import { createObject } from './object'

exports.retrieveAlbumCount = function (board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT COUNT(*)
                FROM snuaaa.tb_album al
                INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
                WHERE ob.board_id = $1
            `;
            db.one(query, board_id)
                .then(function (albumNum) {
                    resolve(albumNum);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

exports.retrieveAlbumCountByCategory = function (board_id, category_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }
        else {
            let query = `
                SELECT COUNT(*)
                FROM snuaaa.tb_album al
                INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
                WHERE ob.board_id = $1
                AND ob.category_id = $2
            `;
            db.one(query, [board_id, category_id])
                .then(function (albumNum) {
                    resolve(albumNum);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}



exports.retrieveAlbums = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
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
                ORDER BY ob.created_at DESC
                LIMIT $2
                OFFSET $3
            `;
            db.any(query, [board_id, rowNum, offset])
                .then(function (albums) {
                    resolve(albums);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};

exports.retrieveAlbumsbyCategory = function (board_id, category_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
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
                ORDER BY ob.created_at DESC
                LIMIT $3
                OFFSET $4
            `;
            db.any(query, [board_id, category_id, rowNum, offset])
                .then(function (albums) {
                    resolve(albums);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};

exports.retrieveAlbumByPhoto = function (photo_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            reject('id can not be null');
        }
        else {
            let query = `
            SELECT al.object_id, ob.title, ob.author_id, usr.name
            FROM snuaaa.tb_photo ph
            INNER JOIN snuaaa.tb_album al ON ph.album_id = al.object_id
            INNER JOIN snuaaa.tb_object ob ON al.object_id = ob.object_id
            INNER JOIN snuaaa.tb_user usr ON ob.author_id = usr.user_id
            WHERE ph.object_id = $1
            ;
            `;
            db.oneOrNone(query, photo_id)
                .then(function (albumInfo) {
                    resolve(albumInfo)
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}


exports.retrieveAlbum = function (album_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            reject('id can not be null');
        }
        else {
            let query = `
            SELECT al.object_id, ob.title, ob.contents, ob.board_id, ob.author_id, usr.nickname
            FROM snuaaa.tb_album al
            INNER JOIN snuaaa.tb_object ob ON (al.object_id = ob.object_id)
            INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
            WHERE al.object_id = $1
            `;
            db.one(query, album_id)
                .then(function (albumInfo) {
                    resolve(albumInfo)
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

exports.createAlbum = function (object_id, user_id, data) {
    return new Promise((resolve, reject) => {

        if (!object_id || !user_id) {
            reject('id can not be null')
        }

        let query = `INSERT INTO snuaaa.tb_album(
            object_id) 
            VALUES ($<object_id>)`;

        let queryData = {
            object_id: object_id,
        };

        db.none(query, queryData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.deleteAlbum = function (album_id) {
    return new Promise((resolve, reject) => {

        if (!album_id) {
            reject('id can not be null')
        }

        let query = `
            DELETE FROM snuaaa.tb_album
            WHERE object_id = $1;
        `;

        db.none(query, album_id)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}
