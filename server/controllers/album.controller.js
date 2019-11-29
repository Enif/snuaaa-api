const models = require('../models');

exports.createAlbum = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.Album.create({
            content_id: content_id
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.retrieveAlbum = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null');
        }

        models.Album.findOne({
            include: [{
                model: models.Content,
                as: 'content',
                required: true,
                include: [{
                    model: models.User,
                    required: true,
                    attributes: ['user_id', 'nickname', 'introduction', 'profile_path'],
                    paranoid: false
                },
                {
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name', 'lv_read']
                }]
            }],
            where: { content_id: content_id }
        })
            .then((albumInfo) => {
                resolve(albumInfo)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

// exports.retrieveAlbumsInBoard = function (board_id, rowNum, offset) {
//     return new Promise((resolve, reject) => {
//         if (!board_id) {
//             reject('id can not be null');
//         }

//         models.Album.findAndCountAll({
//             include: [{
//                 model: models.Content,
//                 as: 'content',
//                 where: { board_id: board_id },
//                 required: true,
//                 include: [{
//                     model: models.User,
//                     required: true,
//                     attributes: ['nickname']
//                 }]
//             }],
//             order: [
//                 [{
//                     model: models.Content,
//                     as: 'content'
//                 },
//                     'updated_at', 'DESC'
//                 ]
//             ],
//             limit: rowNum,
//             offset: offset
//         })
//             .then((albumInfo) => {
//                 resolve(albumInfo);
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     })
// }


exports.retrieveAlbumCount = function (board_id, category_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        let condition = {};
        board_id && (condition.board_id = board_id);
        category_id && (condition.category_id = category_id);

        models.Album.count({
            include: [{
                model: models.Content,
                where: condition,
                required: true
            }]
        })
            .then((count) => {
                resolve(count)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


exports.retrieveAlbumsInBoard = function (board_id, rowNum, offset, category_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('board_id can not be null');
        }

        let condition = {
            board_id: board_id
        };
        category_id && (condition.category_id = category_id);

        models.Album.findAll({
            include: [{
                model: models.Content,
                as: 'content',
                where: condition,
                required: true,
                include: [{
                    model: models.User,
                    required: true,
                    attributes: ['nickname']  
                }, {
                    model: models.Category
                }, {
                    model: models.Photo,
                    as: 'albumPhoto',
                    attributes: ['thumbnail_path'],
                    required: false,
                    separate: true,
                    limit: 1,
                    order: [['content_id', 'DESC']]
                }]
            }, {
                model: models.Photo,
                as: 'thumbnail',
                // include: [{
                //     model: models.Photo,
                //     as: 'photo'
                // }]
            }],
            order: [
                [{
                    model: models.Content,
                    as: 'content'
                },
                    'created_at', 'DESC'
                ]
            ],
            limit: rowNum,
            offset: offset
        })
        .then((albums) => {
            resolve(albums);
        })
        .catch((err) => {
            reject(err);
        });
    })
}


exports.createAlbum = function (content_id, data) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.Album.create({
            content_id: content_id,
            is_private: data.is_private
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.updateAlbum = function (album_id, data) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            reject('album_id can not be null')
        }

        models.Album.update({
            is_private: data.is_private
        },
            {
                where: {
                    content_id: album_id
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

exports.updateAlbumThumbnail = function (album_id, photo_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            reject('album_id can not be null')
        }

        models.Album.update({
            tn_photo_id: photo_id
        },
            {
                where: {
                    content_id: album_id
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