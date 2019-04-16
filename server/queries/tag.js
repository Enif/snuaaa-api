const db = require('./connection');

exports.retrieveTags = function() {
    return new Promise((resolve, reject) => {

    // [TODO] tag table에 board_id FK 추가, tb_photo_tag -> tb_object_tag
        // if(!board_id) {
        //     reject();
        // }
        // else {
            let query = `
                SELECT tag_id, tag_name
                FROM snuaaa.tb_tag
                ;
            `;
            db.any(query, null)
            .then(function(tags){
                resolve(tags);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        // }
    })
};

exports.retrieveTagsOnObject = function(object_id) {
    return new Promise((resolve, reject) => {

        if(!object_id) {
            reject();
        }
        else {

            let query = `
                SELECT tg.tag_id, tg.tag_name
                FROM snuaaa.tb_object ob
                INNER JOIN snuaaa.tb_photo_tag phtg ON (ob.object_id = phtg.object_id)
                INNER JOIN snuaaa.tb_tag tg ON (phtg.tag_id = tg.tag_id)
                WHERE ob.object_id = $1
                ;
            `;
            db.any(query, object_id)
            .then(function(tags){
                resolve(tags);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
};

exports.createPhotoTag = function(object_id, tag) {
    return new Promise((resolve, reject) => {
        if(!object_id || !tag) {
            reject();
        }
        else {
            let query = `
            INSERT INTO snuaaa.tb_photo_tag(
                object_id, tag_id)
                VALUES ($1, $2)
            ;`;

            db.any(query, [object_id, tag])
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
        }
    })
}