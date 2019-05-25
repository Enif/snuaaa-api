const db = require('./connection')
import { createObject } from './object'


exports.retrieveDocument = function(doc_id) {
    return new Promise((resolve, reject) => {

        if(!doc_id) {
            reject();
        }
        else {
            let query = `
            SELECT ob.title, ob.author_id, ob.contents, ob.created_at, ob.like_num, ob.comment_num, ob.board_id,
            doc.object_id, doc.generation, doc.file_path, usr.nickname, usr.profile_path, usr.introduction
            FROM snuaaa.tb_document doc
            INNER JOIN snuaaa.tb_object ob ON (doc.object_id = ob.object_id)
            INNER JOIN snuaaa.tb_user usr ON (ob.author_id = usr.user_id)
            WHERE doc.object_id = $1
            `;
            db.one(query, doc_id)
            .then(function(docuInfo) {
                resolve(docuInfo)
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
}


exports.retrieveDocuments = function() {
    return new Promise((resolve, reject) => {

        let query = `
        SELECT doc.object_id, doc.generation, doc.file_path, ob.title, ctg.category_id, ctg.category_name,
            ob.comment_num, ob.like_num
        FROM snuaaa.tb_document doc
        INNER JOIN snuaaa.tb_object ob ON (doc.object_id = ob.object_id)
        INNER JOIN snuaaa.tb_category ctg ON (ob.category_id = ctg.category_id)
        ORDER BY ob.created_at DESC
        `;
        db.any(query)
        .then(function(docuInfo) {
            resolve(docuInfo)
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

exports.retrieveDocumentsByGen = function(genNum) {
    return new Promise((resolve, reject) => {

        let query = `
        SELECT doc.object_id, doc.generation, ob.title, doc.file_path
        FROM snuaaa.tb_document doc
        INNER JOIN snuaaa.tb_object ob ON (doc.object_id = ob.object_id)
        WHERE doc.generation = $1
        ORDER BY ob.created_at DESC
        `;
        db.any(query, genNum)
        .then(function(docuInfo) {
            resolve(docuInfo)
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
    })
}

exports.createDocument = function(object_id, user_id, data) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_document(
            object_id, generation, file_path) 
            VALUES ($<object_id>, $<generation>, $<file_path>)`; 

        // createObject(user_id, null, data)
        // .then((objectId) => {
            let queryData = {
                object_id: object_id,
                generation: data.generation,
                file_path: data.file_path
            };
            return db.any(query, queryData)            
        // })            
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}

exports.deleteDocument = function(doc_id) {
    return new Promise((resolve, reject) => {

        if(!doc_id) {
            reject('id can not be null')
        }

        let query = `
            DELETE FROM snuaaa.tb_document
            WHERE object_id = $1;
        `;

        db.none(query, doc_id)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}