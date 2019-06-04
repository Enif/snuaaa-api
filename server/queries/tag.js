const db = require('./connection');

exports.retrieveTagsOnBoard = function(board_id) {
    return new Promise((resolve, reject) => {

        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT tag_id, tag_name
                FROM snuaaa.tb_tag
                WHERE board_id = $1
                ;
            `;
            db.any(query, board_id)
            .then(function(tags){
                resolve(tags);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.retrieveTagsOnBoardForObject = function(object_id) {
    return new Promise((resolve, reject) => {

        if(!object_id) {
            reject();
        }
        else {
            let query = `
                SELECT tg.tag_id, tg.tag_name
                FROM snuaaa.tb_object ob
                INNER JOIN snuaaa.tb_tag tg ON (ob.board_id = tg.board_id)
                WHERE object_id = $1
                ;
            `;
            db.any(query, object_id)
            .then(function(tags){
                resolve(tags);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.retrieveTagsOnObject = function(object_id) {
    return new Promise((resolve, reject) => {

        if(!object_id) {
            reject('id can not be null');
        }
        else {

            let query = `
                SELECT tg.tag_id, tg.tag_name
                FROM snuaaa.tb_object ob
                INNER JOIN snuaaa.tb_object_tag phtg ON (ob.object_id = phtg.object_id)
                INNER JOIN snuaaa.tb_tag tg ON (phtg.tag_id = tg.tag_id)
                WHERE ob.object_id = $1
                ;
            `;
            db.any(query, object_id)
            .then(function(tags){
                resolve(tags);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};

exports.createObjectTag = function(object_id, tag) {
    return new Promise((resolve, reject) => {
        if(!object_id || !tag) {
            reject('id can not be null');
        }
        else {
            let query = `
            INSERT INTO snuaaa.tb_object_tag(
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