const db = require('./connection')
import { createObject } from './object'

exports.retrievePhotos = function(album_id) {
    return new Promise((resolve, reject) => {
        if(!album_id) {
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
        .then(function(photos){
            resolve(photos);    
        })
        .catch((err) => {
            reject(err)
        })        }
    })
}

exports.createPhoto = function(_id, data) {
    return new Promise((resolve, reject) => {
        console.log(data)

        if(!_id) {
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
