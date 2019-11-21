const models = require('../models');
const Op = models.Sequelize.Op;

exports.retrievePost = function (content_id) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null');
        }

        models.Post.findOne({
            include: [{
                model: models.Content,
                as: 'content',
                required: true,
                include: [{
                    model: models.User,
                    required: true,
                    attributes: ['user_uuid', 'nickname', 'introduction', 'profile_path']
                },
                {
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name', 'lv_read']
                }]
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

        models.Post.findAndCountAll({
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
                    'created_at', 'DESC'
                ]
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


exports.searchPostsInBoard = function (board_id, keyword, rowNum, offset) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Post.findAndCountAll({
            include: [{
                model: models.Content,
                as: 'content',
                where: {
                    board_id: board_id,
                    title: {
                        [Op.like]: `%${keyword}%`
                    }
                },
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
                    'created_at', 'DESC'
                ]
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

        models.Post.findAll({
            include: [{
                model: models.Content,
                as: 'content',
                required: true,
                include: [{
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name'],
                    where: {
                        lv_read: {
                            [Op.lte]: level
                        }
                    }
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

        models.Post.findAndCountAll({
            include: [{
                model: models.Content,
                as: 'content',
                required: true,
                include: [{
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
            models.Post.findAll({
                include: [{
                    model: models.Content,
                    as: 'content',
                    required: true,
                    include: [{
                        model: models.Board,
                        required: true,
                        attributes: ['board_id', 'board_name']
                    }],
                    where: {
                        author_id: user_id,
                    }
                }],
                order: [
                    [{
                        model: models.Content,
                        as: 'content'
                    },
                        'updated_at', 'DESC'
                    ]
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
            models.Post.findAll({
                include: [{
                    model: models.Content,
                    as: 'content',
                    required: true,
                    include: [{
                        model: models.Board,
                        required: true,
                        attributes: ['board_id', 'board_name']
                    },
                    {
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
                        as: 'content'
                    },
                        'updated_at', 'DESC'
                    ]
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

        models.Post.findOne({
            include: [{
                model: models.Content,
                as: 'content',
                attributes: ['content_id', 'title', 'text'],
                required: true,
                include: [{
                    model: models.Board,
                    required: true,
                    attributes: [],
                    where: { board_id: 'brd01' }
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

exports.createPost = function (content_id, data) {
    return new Promise((resolve, reject) => {
        if (!content_id) {
            reject('id can not be null')
        }

        models.Post.create({
            content_id: content_id,
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}