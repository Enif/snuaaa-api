const models = require('../models');
const uuid4 = require('uuid4');

exports.createContent = function (user_id, board_id, data, type) {
    return new Promise((resolve, reject) => {
        if (!user_id || !board_id) {
            reject('id can not be null')
        }

        models.Content.create({
            content_uuid: uuid4(),
            author_id: user_id,
            board_id: board_id,
            category_id: data.category_id,
            title: data.title,
            text: data.text,
            type: type
        })
            .then((content) => {
                resolve(content.dataValues.content_id);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.updateContent = function (content_id, data) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.Content.update({
            title: data.title,
            text: data.text,
        },
        {
            where: {
                content_id: content_id
            }    
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.deleteContent = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.Content.destroy(
        {
            where: {
                content_id: content_id
            }    
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

