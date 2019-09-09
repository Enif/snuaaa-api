const models = require('../models');

exports.retrievePhoto = function (photo_id) {
    return new Promise((resolve, reject) => {
        if (!photo_id) {
            reject('id can not be null')
        }

        models.Photo.findOne({
            include: [{
                model: models.Content,
                as: 'contentPhoto',
                required: true,
                include: [{
                    model: models.User,
                    required: true,
                    attributes: ['user_id', 'nickname', 'introduction', 'profile_path']
                },
                {
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name', 'lv_read']
                },
                {
                    model: models.Tag
                }]
            }, {
                as: 'album',
                model: models.Content,
                // required: true
            }],
            where: { content_id: photo_id },
            order: [
                ['contentPhoto', models.Tag, 'tag_type', 'ASC'],
                ['contentPhoto', models.Tag, 'tag_id', 'ASC']
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

exports.retrievePhotosInAlbum = function (album_id) {
    return new Promise((resolve, reject) => {
        if (!album_id) {
            reject('id can not be null')
        }
        else {
            models.Photo.findAll({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    // where: { board_id: board_id },
                    required: true,
                    include: [{
                        model: models.User,
                        required: true,
                        attributes: ['nickname']
                    }]
                }],
                where: { album_id: album_id },
                order: [
                    [{
                        model: models.Content,
                        as: 'contentPhoto'
                    },
                        'created_at', 'DESC'
                    ]
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
            models.Photo.count({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    where: { board_id: board_id },
                    required: true
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

exports.retrievePhotosInBoard = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }
        else {
            models.Photo.findAll({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    where: { board_id: board_id },
                    required: true,
                    include: [{
                        model: models.User,
                        required: true,
                        attributes: ['nickname']
                    }]
                }],
                order: [
                    [{
                        model: models.Content,
                        as: 'contentPhoto'
                    },
                        'created_at', 'DESC'
                    ]
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
            models.Photo.count({
                distinct: true,
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    required: true,
                    include: [{
                        model: models.Tag,
                        where: {
                            tag_id: tags
                        }
                    }]
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
            models.Photo.findAll({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    required: false,
                    duplicating: true,
                    include: [{
                        model: models.Tag,
                        through: models.ContentTag,
                        where: {
                            tag_id: tags
                        }
                    }],
                }],
                order: [
                    [{
                        model: models.Content,
                        as: 'contentPhoto'
                    },
                        'created_at', 'DESC'
                    ]
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
            models.Photo.findAll({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    required: true,
                    where: {
                        author_id: user_id,
                    }
                }],
                order: [
                    [{
                        model: models.Content,
                        as: 'contentPhoto'
                    },
                        'updated_at', 'DESC'
                    ]
                ],
                limit: 16
            })
                .then(function (posts) {
                    resolve(posts);
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
            models.Photo.findAll({
                include: [{
                    model: models.Content,
                    as: 'contentPhoto',
                    required: true,
                    include: [{
                        model: models.User,
                        required: true,
                        where: {
                            user_uuid: user_uuid,
                        }        
                    }]
                }],
                order: [
                    [{
                        model: models.Content,
                        as: 'contentPhoto'
                    },
                        'updated_at', 'DESC'
                    ]
                ],
                limit: 16
            })
                .then(function (posts) {
                    resolve(posts);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};

exports.createPhoto = function (content_id, data) {
    return new Promise((resolve, reject) => {

        if (!content_id) {
            reject('id can not be null')
        }
        else {
            models.Photo.create({
                content_id: content_id,
                album_id: data.album_id,
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