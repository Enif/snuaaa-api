const models = require('../models');

exports.retrieveTagsByContent = function (content_id) {

    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.ContentTag.findAll({
            where: {
                content_id: content_id
            }
        })
            .then((tags) => {
                resolve(tags);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.createContentTag = function (content_id, tag_id) {

    return new Promise((resolve, reject) => {
        if (!content_id || !tag_id) {
            reject('id can not be null')
        }

        models.ContentTag.create({
            content_id: content_id,
            tag_id: tag_id
        })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.deleteContentTag = function (content_id, tag_id) {

    return new Promise((resolve, reject) => {
        if (!content_id || !tag_id) {
            reject('id can not be null')
        }

        models.ContentTag.destroy({
            where: {
                content_id: content_id,
                tag_id: tag_id    
            }
        })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.checkContentTag = function (content_id, tag_id) {

    return new Promise((resolve, reject) => {
        if (!content_id || !tag_id) {
            reject('id can not be null')
        }

        models.ContentTag.findOne({
            where: {
                content_id: content_id,
                tag_id: tag_id
            }
        })
            .then((isExist) => {
                if (isExist) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch((err) => {
                reject(err);
            })

    })
}