const models = require('../models');

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
