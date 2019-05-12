const db = require('./connection')


exports.createObject = function(user_id, board_id, data) {

    return new Promise((resolve, reject) => {
        
        if(!user_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_object(
            author_id, category_id, board_id, type, title, contents, created_at) 
            VALUES ($<user_id>, $<category_id>, $<board_id>, $<type>, $<title>, $<contents>, $<created>)
            RETURNING object_id`; 

        let created = new Date()
        
        let queryData = {
            user_id: user_id,
            category_id: data.category_id,
            board_id: board_id,
            type: data.type,
            title: data.title,
            contents: data.contents,
            created: created
        };
            
        
        db.one(query, queryData, object => object.object_id)
        .then((object_id) => {
            resolve(object_id);
        })
        .catch((err) => {
            reject(err);
        });
    })   
}

exports.updateObject = function(object_id, objectData) {
    return new Promise((resolve, reject) => {

        if(!object_id) {
            reject('id can not be null')
        }

        let query = `
            UPDATE snuaaa.tb_object
            SET title=$<title>,
            contents=$<contents>
            WHERE object_id=$<object_id>;
        `;

        let queryData = {
            object_id: object_id,
            title: objectData.title,
            contents: objectData.contents
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

exports.deleteObject = function(object_id) {
    return new Promise((resolve, reject) => {

        if(!object_id) {
            reject('id can not be null')
        }

        let query = `
            DELETE FROM snuaaa.tb_object
            WHERE object_id = $1;
        `;

        db.none(query, object_id)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.updateCommentNum = function(object_id) {
    return new Promise((resolve, reject) => {
        if(!object_id) {
            reject('id can not be null')
        }

        const query = `
        UPDATE snuaaa.tb_object ob
        SET comment_num= (
            SELECT COUNT(*)
            FROM snuaaa.tb_comment co
            WHERE co.parent_id = ob.object_id
        )
        WHERE ob.object_id = $<object_id>
        ;`;

        db.any(query, {object_id: object_id})
        .then(() => {
            resolve()
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.updateLikeNum = function(object_id) {
    return new Promise((resolve, reject) => {
        
        if(!object_id) {
            reject('id can not be null')
        }

        const query = `
        UPDATE snuaaa.tb_object
            SET like_num = (
                SELECT COUNT(*)
                FROM snuaaa.tb_object_like
                WHERE object_id = $<object_id>
            )
        WHERE object_id = $<object_id>
        ;`;

        db.any(query, {object_id: object_id})
        .then(() => {
            resolve()
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.checkLike = function(user_id, object_id) {
    return new Promise((resolve, reject) => {
        
        if(!user_id || !object_id) {
            reject('id can not be null')
        }

        const query = `
        SELECT EXISTS(
            SELECT user_id
            FROM snuaaa.tb_object_like
            WHERE object_id = $<object_id>
            AND user_id = $<user_id>
        )
        ;`;

        const queryData = {
            user_id: user_id,
            object_id: object_id
        }

        db.one(query, queryData)
        .then((isLiked) => {
            console.log(isLiked)
            resolve(isLiked.exists)
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.likeObject = function(user_id, object_id) {

    return new Promise((resolve, reject) => {
        if(!user_id || !object_id) {
            reject('id can not be null')
        }

        const query = `
        INSERT INTO snuaaa.tb_object_like(
        object_id, user_id) 
        VALUES ($<object_id>, $<user_id>)
        ;`;
        
        const queryData = {
            user_id: user_id,
            object_id: object_id
        }

        db.any(query, queryData)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err)
        })

    })
}

exports.dislikeObject = function(user_id, object_id) {

    return new Promise((resolve, reject) => {
        if(!user_id || !object_id) {
            reject('id can not be null')
        }
        
        const query = `
        DELETE FROM snuaaa.tb_object_like
        WHERE object_id = $<object_id>
        AND user_id = $<user_id>
        ;`;
        
        const queryData = {
            user_id: user_id,
            object_id: object_id
        }

        db.any(query, queryData)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err)
        })

    })
}