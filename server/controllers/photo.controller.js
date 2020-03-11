const models = require('../models');
const Op = models.Sequelize.Op;

exports.retrievePhoto = function (photo_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            reject('id can not be null')
        }

        models.Content.findOne({
            include: [{
                model: models.Photo,
                as: 'photo',
                required: true,
                // include: [{
                //     as: 'album',
                //     model: models.Content,
                // }]
            },
            {
                model: models.Content,
                as: 'parent',
                include: [{
                    model: models.Album,
                    as: 'album',
                    require: true
                }]
            },
            {
                model: models.User,
                required: true,
                attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'grade', 'level', 'profile_path']
            },
            {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name', 'lv_read']
            },
            {
                model: models.Tag,
                through: models.ContentTag,
                as: 'tags'
            }],
            where: { content_id: photo_id },
            order: [
                ['tags', 'tag_type', 'ASC'],
                ['tags', 'tag_id', 'ASC']
            ]
        })
            .then((photoInfo) => {
                resolve(photoInfo)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.retrievePrevPhoto = function (photo_id, album_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            reject('photo_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }],
                where: {
                    content_id: {
                        [Op.lt]: photo_id
                    },
                    parent_id: album_id
                },
                order: [
                    ['content_id', 'DESC']
                ]
            })
                .then((photo) => {
                    resolve(photo);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrieveNextPhoto = function (photo_id, album_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            reject('photo_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }],
                where: {
                    content_id: {
                        [Op.gt]: photo_id
                    },
                    parent_id: album_id
                },
                order: [
                    ['content_id', 'ASC']
                ]
            })
                .then((photo) => {
                    resolve(photo);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrievePrevAlbumPhoto = function (album_id, board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('board_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }],
                where: {
                    parent_id: {
                        [Op.lt]: album_id
                    },
                    board_id: board_id
                },
                order: [
                    ['parent_id', 'DESC'],
                    ['content_id', 'DESC'],
                ]
            })
                .then((photo) => {
                    resolve(photo);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrieveNextAlbumPhoto = function (album_id, board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('board_id can not be null')
        }
        else {
            models.Content.findOne({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }],
                where: {
                    parent_id: {
                        [Op.gt]: album_id
                    },
                    board_id: board_id
                },
                order: [
                    ['parent_id', 'ASC'],
                    ['content_id', 'DESC'],
                ]
            })
                .then((photo) => {
                    resolve(photo);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrievePhotosInAlbum = function (album_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            reject('id can not be null')
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                },
                {
                    model: models.User,
                    required: true,
                    attributes: ['nickname']
                }],
                where: { parent_id: album_id },
                order: [
                    ['created_at', 'DESC'],
                    ['content_id', 'DESC']
                ]
            })
                .then((photos) => {
                    resolve(photos);
                })
                .catch((err) => {
                    reject(err);
                })
        }
    })
}

exports.retrievePhotoCountInBoard = function (board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }
        else {
            models.Content.count({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true
                }],
                where: { board_id: board_id }
            })
                .then((count) => {
                    resolve(count);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

exports.retrievePhotosInBoard = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                },
                {
                    model: models.User,
                    required: true,
                    attributes: ['nickname']

                }],
                where: { board_id: board_id },
                order: [
                    ['created_at', 'DESC'],
                    ['content_id', 'DESC']
                ],
                limit: rowNum,
                offset: offset
            })
                .then((photos) => {
                    resolve(photos);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

exports.retrievePhotoCountByTag = function (tags) {
    return new Promise((resolve, reject) => {
        if (!tags) {
            reject('tag can not be null');
        }
        else {
            models.Content.count({
                distinct: true,
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }, {
                    model: models.Tag,
                    as: 'tags',
                    where: {
                        tag_id: tags
                    }
                }]
            })
                .then((count) => {
                    resolve(count);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}

exports.retrievePhotosByTag = function (tags, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!tags) {
            reject('tag can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                },
                {
                    model: models.Tag,
                    through: models.ContentTag,
                    as: 'tags',
                    where: {
                        tag_id: tags
                    }
                }],
                order: [
                    ['created_at', 'DESC'],
                    ['content_id', 'DESC']
                ],
                limit: rowNum,
                offset: offset
            })
                .then((photos) => {
                    resolve(photos);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
}


exports.retrievePhotosByUser = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('id can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }],
                where: {
                    author_id: user_id,
                },
                order: [
                    ['updated_at', 'DESC']
                ],
                limit: 16
            })
                .then((photos) => {
                    resolve(photos);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};

exports.retrievePhotosByUserUuid = function (user_uuid) {
    return new Promise((resolve, reject) => {
        if (!user_uuid) {
            reject('user_uuid can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Photo,
                    as: 'photo',
                    required: true,
                }, {
                    model: models.User,
                    required: true,
                    attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'profile_path'],
                    where: {
                        user_uuid: user_uuid,
                    }
                }],
                order: [
                    ['updated_at', 'DESC']
                ],
                limit: 16
            })
                .then((photos) => {
                    resolve(photos);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};

exports.createPhoto = function (data) {
    return new Promise((resolve, reject) => {

        models.Content.create({
            content_uuid: data.content_uuid,
            author_id: data.author_id,
            board_id: data.board_id,
            category_id: data.category_id,
            title: data.title,
            text: data.text,
            type: 'PH',
            parent_id: data.album_id,
            photo: {
                file_path: data.file_path,
                thumbnail_path: data.thumbnail_path,
                location: data.location,
                camera: data.camera,
                lens: data.lens,
                exposure_time: data.exposure_time,
                focal_length: data.focal_length,
                f_stop: data.f_stop,
                iso: data.iso,
                date: data.date
            }
        }, {
            include: [{
                model: models.Photo,
                as: 'photo'
            }]
        })
            .then((content) => {
                resolve(content.dataValues.content_id);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.updatePhoto = function (photo_id, data) {
    return new Promise((resolve, reject) => {

        if (!photo_id) {
            reject('id can not be null')
        }
        else {
            models.Photo.update({
                file_path: data.file_path,
                thumbnail_path: data.thumbnail_path,
                location: data.location,
                camera: data.camera,
                lens: data.lens,
                exposure_time: data.exposure_time,
                focal_length: data.focal_length,
                f_stop: data.f_stop,
                iso: data.iso,
                date: data.date
            }, {
                where: {
                    content_id: photo_id
                }
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

exports.deletePhoto = function (photo_id) {
    return new Promise((resolve, reject) => {

        if (!photo_id) {
            reject('id can not be null')
        }
        else {
            models.Photo.destroy({
                where: {
                    content_id: photo_id
                }
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