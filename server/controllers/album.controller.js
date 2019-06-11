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

exports.retrieveAlbumsInBoard = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Album.findAndCountAll({
            include: [{
                model: models.Content,
                as: 'content',
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
                    as: 'content'
                },
                    'updated_at', 'DESC'
                ]
            ],
            limit: rowNum,
            offset: offset
        })
            .then((albumInfo) => {
                resolve(albumInfo);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


exports.retrieveAlbumCountByCategory = function (board_id, category_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        let condition = {};
        board_id && (condition.board_id = board_id);
        category_id && (condition.category_id = category_id);

        models.Content.count({
            where: condition
        })
            .then((count) => {
                resolve(count)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


exports.retrieveAlbums = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.sequelize.query(
            `SELECT al.content_id, ob.category_id, ob.title, ob.text, ob.created_at, usr.nickname, ctg.category_color,
            (
                SELECT ph.file_path
                FROM tb_photo ph
                INNER JOIN tb_content phobj ON (phobj.content_id = ph.content_id)
                WHERE ph.album_id = al.content_id
                ORDER BY phobj.created_at DESC
                LIMIT 1
            )
            FROM tb_album al
            INNER JOIN tb_content ob ON (al.content_id = ob.content_id)
            INNER JOIN tb_user usr ON (ob.author_id = usr.user_id)
            LEFT OUTER JOIN tb_category ctg ON (ob.category_id = ctg.category_id)
            WHERE ob.board_id = :board_id
            ORDER BY ob.created_at DESC
            LIMIT :limit
            OFFSET :offset`,
            {
                replacements: {
                    board_id: board_id,
                    limit: rowNum,
                    offset: offset
                },
                type: models.sequelize.QueryTypes.SELECT
            }
        )
            .then((albums) => {
                resolve(albums);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


exports.retrieveAlbumsByCategory = function (board_id, category_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.sequelize.query(
            `SELECT al.content_id, ob.category_id, ob.title, ob.text, ob.created_at, usr.nickname, ctg.category_color,
            (
                SELECT ph.file_path
                FROM tb_photo ph
                INNER JOIN tb_content phobj ON (phobj.content_id = ph.content_id)
                WHERE ph.album_id = al.content_id
                ORDER BY phobj.created_at DESC
                LIMIT 1
            )
            FROM tb_album al
            INNER JOIN tb_content ob ON (al.content_id = ob.content_id)
            INNER JOIN tb_user usr ON (ob.author_id = usr.user_id)
            LEFT OUTER JOIN tb_category ctg ON (ob.category_id = ctg.category_id)
            WHERE ob.board_id = :board_id
            AND ob.category_id = :category_id
            ORDER BY ob.created_at DESC
            LIMIT :limit
            OFFSET :offset`,
            {
                replacements: {
                    board_id: board_id,
                    category_id: category_id,
                    limit: rowNum,
                    offset: offset
                },
                type: models.sequelize.QueryTypes.SELECT
            }
        )
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