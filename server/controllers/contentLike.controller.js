const models = require('../models');

exports.checkLike = function (content_id, user_id) {

    return new Promise((resolve, reject) => {
        if (!user_id || !content_id) {
            reject('id can not be null')
        }

        models.ContentLike.findOne({
            where: {
                content_id: content_id,
                user_id: user_id
            }
        })
            .then((contentLike) => {
                if (contentLike) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.likeContent = function (content_id, user_id) {

    return new Promise((resolve, reject) => {
        if (!user_id || !content_id) {
            reject('id can not be null')
        }

        models.ContentLike.create({
            content_id: content_id,
            user_id: user_id
        })
            .then(() => {
                models.Content.increment('like_num',
                    { where: { content_id: content_id } }
                )
            })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.dislikeContent = function (content_id, user_id) {

    return new Promise((resolve, reject) => {
        if (!user_id || !content_id) {
            reject('id can not be null')
        }

        models.ContentLike.destroy({
            where: {
                content_id: content_id,
                user_id: user_id
            }
        })
            .then(() => {
                models.Content.decrement('like_num',
                    { where: { content_id: content_id } }
                )
            })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}
