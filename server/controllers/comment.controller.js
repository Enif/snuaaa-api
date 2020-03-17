const models = require('../models');
const Op = models.Sequelize.Op;

exports.retrieveComments = function (parent_id) {
    return new Promise((resolve, reject) => {
        if (!parent_id) {
            reject('id can not be null');
        }

        models.Comment.findAll({
            include: [{
                model: models.User,
                required: true,
                attributes: ['user_id', 'user_uuid', 'nickname', 'profile_path']
            }],
            where: { parent_id: parent_id },
            order: ['created_at']
        })
            .then((comments) => {
                resolve(comments)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.retrieveRecentComments = function() {
    return new Promise((resolve, reject) => {

        models.Comment.findAll({
            include: [{
                model: models.Content,
                required: true,
                include: [{
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name']
                }]
            }],
            order: [['created_at', 'DESC']],
            limit: 5
        })
        .then((comments) => {
            resolve(comments);    
        })
        .catch((err) => {
            reject(err)
        })
    })
}

exports.retrieveAllComments = function(grade, rowNum, offset) {
    return new Promise((resolve, reject) => {

        models.Comment.findAndCountAll({
            include: [{
                model: models.Content,
                required: true,
                include: [{
                    model: models.Board,
                    required: true,
                    attributes: ['board_id', 'board_name'],
                    where: {
                        lv_read: {
                            [Op.gte]: grade
                        }
                    }
                }]
            }],
            order: [['created_at', 'DESC']],
            limit: rowNum,
            offset: offset
        })
        .then((comments) => {
            resolve(comments);    
        })
        .catch((err) => {
            reject(err)
        })
    })
}


exports.retrieveCommentsByUser = function(user_id) {
    return new Promise((resolve, reject) => {
        if(!user_id) {
            reject('id can not be null');
        }
        else {
            models.Comment.findAll({
                include: [{
                    model: models.Content,
                    required: true,
                    include: [{
                        model: models.Board,
                        required: true,
                        attributes: ['board_id', 'board_name']
                    }]
                }],
                where: {
                    author_id: user_id,
                },
                order: [['created_at', 'DESC']],
                limit: 15
            })
            .then(function(posts){
                resolve(posts);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};


exports.retrieveCommentsByUserUuid = function(user_uuid) {
    return new Promise((resolve, reject) => {
        if(!user_uuid) {
            reject('user_uuid can not be null');
        }
        else {
            models.Comment.findAll({
                include: [{
                    model: models.Content,
                    required: true,
                    include: [{
                        model: models.Board,
                        required: true,
                        attributes: ['board_id', 'board_name']
                    }
                    ]
                },
                {
                    model: models.User,
                    required: true,
                    attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'profile_path'],
                    where: {
                        user_uuid: user_uuid,
                    }        
                }],
                order: [['created_at', 'DESC']],
                limit: 15
            })
            .then(function(posts){
                resolve(posts);    
            })
            .catch((err) => {
                reject(err)
            })
        }
    })
};


exports.createComment = function (user_id, parent_id, data) {
    return new Promise((resolve, reject) => {
        if (!user_id || !parent_id) {
            reject('id can not be null')
        }

        let comment_id = ''
        models.Comment.create({
            parent_id: parent_id,
            author_id: user_id,
            text: data.text
        })
            .then((comment) => {
                comment_id = comment.dataValues.comment_id;
                return models.Content.increment('comment_num',
                    {
                        where: { content_id: parent_id },
                        silent: true
                    }
                )
            })
            .then(() => {
                resolve(comment_id)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.updateComment = function (comment_id, data) {
    return new Promise((resolve, reject) => {
        if (!comment_id) {
            reject('id can not be null')
        }

        models.Comment.update({
            text: data.text,
        },
            {
                where: {
                    comment_id: comment_id
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

exports.deleteComment = function (comment_id) {
    return new Promise((resolve, reject) => {
        if (!comment_id) {
            reject('id can not be null')
        }

        models.Comment.findOne({
            where: {
                comment_id: comment_id
            }
        })
            .then((comment) => {
                return models.Content.decrement('comment_num', {
                    where: {
                        content_id: comment.parent_id
                    },
                    silent: true
                })
            })
            .then(() => {
                return models.Comment.destroy(
                    {
                        where: {
                            comment_id: comment_id
                        }
                    })
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}

