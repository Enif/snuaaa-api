const models = require('../models');

export function retrieveTagsByContent(content_id) {

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

export function createContentTag(content_id, tag_id) {

    return new Promise<void>((resolve, reject) => {
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

export function deleteContentTag(content_id, tag_id) {

    return new Promise<void>((resolve, reject) => {
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

export function checkContentTag(content_id, tag_id) {

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