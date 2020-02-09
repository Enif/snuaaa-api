const models = require('../models');
const Op = models.Sequelize.Op;

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

        models.Content.findOne({
            include: [{
                model: models.Album,
                as: 'album',
                required: true
            }, {
                model: models.User,
                required: true,
                attributes: ['user_id', 'nickname', 'introduction', 'profile_path'],
                paranoid: false
            }, {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name', 'lv_read']
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


exports.retrievePrevAlbum = function (album_id, board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('board_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Album,
                    as: 'album',
                    required: true,
                }],
                where: {
                    content_id: {
                        [Op.lt]: album_id
                    },
                    board_id: board_id
                },
                order: [
                    ['content_id', 'DESC']
                ]
            })
                .then((album) => {
                    resolve(album);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}


exports.retrieveNextAlbum = function (album_id, board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('board_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Album,
                    as: 'album',
                    required: true,
                }],
                where: {
                    content_id: {
                        [Op.gt]: album_id
                    },
                    board_id: board_id
                },
                order: [
                    ['content_id', 'ASC']
                ]
            })
                .then((album) => {
                    resolve(album);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}



exports.retrieveAlbumCount = function (board_id, category_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        let condition = {};
        board_id && (condition.board_id = board_id);
        category_id && (condition.category_id = category_id);

        models.Content.count({
            include: [{
                model: models.Album,
                as: 'album',
                required: true
            }],
            where: condition,
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

        models.Content.findAll({
            include: [{
                model: models.Album,
                as: 'album',
                required: true,
                include: [
                    {
                        model: models.Content,
                        as: 'thumbnail',
                        include: [{
                            model: models.Photo,
                            as: 'photo',
                            required: true
                        }]
                    }]
            }, {
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
            }],
            where: condition,
            order: [
                ['created_at', 'DESC']
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