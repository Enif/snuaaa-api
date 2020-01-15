const models = require('../models');

exports.retrieveExhibition = function (exhibition_id) {
    return new Promise((resolve, reject) => {
        if (!exhibition_id) {
            reject('exhibition_id can not be null');
        }

        models.Content.findOne({
            include: [{
                model: models.Exhibition,
                as: 'exhibition',
                require: true
            }, {
                model: models.User,
                required: true,
                attributes: ['user_id', 'nickname', 'introduction', 'profile_path']
            },
            {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name', 'lv_read', 'lv_write']
            }],
            where: { content_id: exhibition_id }
        })
            .then((exhibitionInfo) => {
                resolve(exhibitionInfo);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.retrieveExhibitions = function () {
    return new Promise((resolve, reject) => {
        models.Content.findAll({
            include: [{
                model: models.Exhibition,
                as: 'exhibition',
                required: true
            }, {
                model: models.User,
                required: true,
                attributes: ['user_id', 'nickname', 'introduction', 'profile_path']
            }, {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name', 'lv_read']
            }
            ],
            order: [
                ['exhibition', 'exhibition_no', 'DESC']
            ]
        })
            .then((exhibitionInfo) => {
                resolve(exhibitionInfo)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.createExhibition = function (content_id, data) {
    return new Promise((resolve, reject) => {

        if (!content_id) {
            reject('content_id can not be null')
        }
        else {
            models.Exhibition.create({
                content_id: content_id,
                exhibition_no: data.exhibition_no,
                slogan: data.slogan,
                date_start: data.date_start,
                date_end: data.date_end,
                place: data.place,
                poster_path: data.poster_path,
                poster_thumbnail_path: data.poster_thumbnail_path
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
