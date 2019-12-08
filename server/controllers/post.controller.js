const models = require('../models');
const uuid4 = require('uuid4');
const Op = models.Sequelize.Op;

const SearchTypeEnum = Object.freeze({
    ALL: 'A',
    TITLE: 'T',
    TEXT: 'X',
    USER: 'U'
})

exports.retrievePost = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null');
        }

        models.Content.findOne({
            include: [{
                model: models.Post,
                as: 'post',
            }, {
                model: models.User,
                required: true,
                attributes: ['user_uuid', 'nickname', 'introduction', 'profile_path']
            },
            {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name', 'lv_read']
            }],
            where: { content_id: content_id }
        })
            .then((postInfo) => {
                resolve(postInfo)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.retrievePostsInBoard = function (board_id, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Content.findAndCountAll({
            include: [{
                model: models.Post,
                as: 'post',
            }, {
                model: models.User,
                required: true,
                attributes: ['nickname']
            }],
            where: { board_id: board_id },
            order: [
                ['created_at', 'DESC']
            ],
            limit: rowNum,
            offset: offset
        })
            .then((postInfo) => {
                resolve(postInfo);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


exports.searchPostsInBoard = function (board_id, type, keyword, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        let contentCondition;
        let userCondition;
        if (type === SearchTypeEnum.ALL) {
            contentCondition = {
                board_id: board_id,
                [Op.or]: [{
                    title: {
                        [Op.like]: `%${keyword}%`
                    },
                    text: {
                        [Op.like]: `%${keyword}%`
                    }
                }]
            }
        }
        else if (type === SearchTypeEnum.TITLE) {
            contentCondition = {
                board_id: board_id,
                title: {
                    [Op.like]: `%${keyword}%`
                }
            }
        }
        else if (type === SearchTypeEnum.TEXT) {
            contentCondition = {
                board_id: board_id,
                text: {
                    [Op.like]: `%${keyword}%`
                }
            }
        }
        else if (type === SearchTypeEnum.USER) {
            contentCondition = {
                board_id: board_id,
            }
            userCondition = {                
                nickname: {
                    [Op.like]: `%${keyword}%`
                }
            }
        }
        else {
            contentCondition = {
                board_id: board_id
            }
        }

        models.Content.findAndCountAll({
            include: [{
                model: models.Post,
                required: true,
                as: 'post'
            }, {
                model: models.User,
                required: true,
                attributes: ['nickname'],
                where: userCondition
            }],
            where: contentCondition,
            order: [
                ['created_at', 'DESC']
            ],
            limit: rowNum,
            offset: offset
        })
            .then((postInfo) => {
                resolve(postInfo);
            })
            .catch((err) => {
                reject(err);
            });
    })
}


exports.retrieveRecentPosts = function (level) {
    return new Promise((resolve, reject) => {

        models.Content.findAll({
            include: [{
                model: models.Post,
                as: 'post',
                required: true
            }, {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name'],
                where: {
                    lv_read: {
                        [Op.lte]: level
                    }
                }
            }],
            order: [
                ['updated_at', 'DESC']
            ],
            limit: 7
        })
            .then(function (posts) {
                resolve(posts);
            })
            .catch((err) => {
                reject(err)
            })
    })
}

exports.retrieveAllPosts = function (level, rowNum, offset) {
    return new Promise((resolve, reject) => {

        models.Content.findAndCountAll({
            include: [{
                model: models.Post,
                as: 'post',
                required: true
            }, {
                model: models.Board,
                required: true,
                attributes: ['board_id', 'board_name'],
                where: {
                    lv_read: {
                        [Op.lte]: level
                    }
                }
            }, {
                model: models.User,
                required: true,
                attributes: ['nickname']
            }],
            order: [
                ['updated_at', 'DESC']
            ],
            limit: rowNum,
            offset: offset
        })
            .then(function (posts) {
                resolve(posts);
            })
            .catch((err) => {
                reject(err)
            })
    })
}

exports.retrievePostsByUser = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('id can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Post,
                    as: 'post',
                    required: true
                }, {
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name']
                },
                ],
                where: {
                    author_id: user_id,
                },
                order: [
                    ['updated_at', 'DESC']
                ],
                limit: 10
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

exports.retrievePostsByUserUuid = function (user_uuid) {
    return new Promise((resolve, reject) => {
        if (!user_uuid) {
            reject('id can not be null');
        }
        else {
            models.Content.findAll({
                include: [{
                    model: models.Post,
                    as: 'post',
                    required: true,
                }, {
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name']
                },
                {
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
                limit: 10
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


exports.retrieveSoundBox = function () {
    return new Promise((resolve, reject) => {

        models.Content.findOne({
            attributes: ['content_id', 'title', 'text'],
            include: [{
                model: models.Post,
                as: 'post',
                required: true,
            }, {
                model: models.Board,
                required: true,
                attributes: [],
            }],
            where: { board_id: 'brd01' },
            order: [
                ['updated_at', 'DESC']
            ],
            limit: 1
        })
            .then(function (post) {
                resolve(post);
            })
            .catch((err) => {
                reject(err)
            })
    })
}

exports.createPost = function (data) {
    return new Promise((resolve, reject) => {
        models.Content.create({
            content_uuid: uuid4(),
            author_id: data.author_id,
            board_id: data.board_id,
            category_id: data.category_id,
            title: data.title,
            text: data.text,
            type: 'PO',
            post: {
            }
        }, {
            include: [{
                model: models.Post,
                as: 'post'
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