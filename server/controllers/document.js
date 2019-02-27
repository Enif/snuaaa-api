const db = require('./connection')
import { createObject } from './object'


exports.retrieveDocument = function(doc_id) {
    return new Promise((resolve, reject) => {

        if(!doc_id) {
            reject();
        }
        else {
            let query = `
            SELECT doc.object_id, generation, title, file_path
            FROM snuaaa.tb_document doc
            WHERE doc.object_id = $1
            `;
            db.one(query, doc_id)
            .then(function(docuInfo) {
                resolve(docuInfo)
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
}


exports.retrieveDocuments = function() {
    return new Promise((resolve, reject) => {

        let query = `
        SELECT doc.object_id, generation, title, file_path
        FROM snuaaa.tb_document doc
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
        SELECT doc.object_id, generation, title, file_path
        FROM snuaaa.tb_document doc
        WHERE doc.generation = $1
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

exports.createDocument = function(_id, data) {
    return new Promise((resolve, reject) => {

        if(!_id) {
            console.log('id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa.tb_document(
            object_id, generation, title, file_path) 
            VALUES ($<object_id>, $<generation>, $<title>, $<file_path>)`; 

        createObject(_id)
        .then((objectId) => {
            let queryData = {
                object_id: objectId,
                generation: data.generation,
                title: data.title,
                file_path: data.file_path
            };
            return db.any(query, queryData)            
        })            
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}
