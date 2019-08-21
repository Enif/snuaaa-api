const models = require('../models');

exports.createAttachedFile = function (content_id, data) {
    return new Promise((resolve, reject) => {

        if (!content_id) {
            reject('id can not be null')
        }
        else {
            models.AttachedFile.create({
                parent_id: content_id,
                original_name: data.original_name,
                file_path: data.file_path,
                file_type: data.file_type
            })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrieveAttachedFile = function (file_id) {
    return new Promise((resolve, reject) => {
        if (!file_id) {
            reject('id can not be null')
        }
        else {
            models.AttachedFile.findOne({
                attributes: ['file_id', 'original_name', 'file_path', 'file_type'],
                where: { file_id: file_id }
            })
            .then((file) => {
                resolve(file);
            })
            .catch((err) => {
                reject(err);
            })
        }
    })
}

exports.retrieveAttachedFilesInContent = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }
        else {
            models.AttachedFile.findAll({
                attributes: ['file_id', 'original_name', 'file_type'],
                where: { parent_id: content_id},
                order: [
                    ['file_id', 'ASC']
                ]
            })
            .then((files) => {
                resolve(files);
            })
            .catch((err) => {
                reject(err);
            })
        }
    })
}

exports.increaseDownloadCount = function (file_id) {
    return new Promise((resolve, reject) => {
        if (!file_id) {
            reject('file_id can not be null')
        }

        models.AttachedFile.increment('download_count',
            {
                where: { file_id: file_id },
                silent: true
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}