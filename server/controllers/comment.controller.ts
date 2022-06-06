const models = require('../models');
import { Op } from 'sequelize';

export function retrieveComments(parent_id, user_id) {
    return new Promise((resolve, reject) => {
        if (!parent_id || !user_id) {
            reject('id can not be null');
        }

        models.Comment.findAll({
            include: [{
                model: models.User,
                required: true,
                attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'grade', 'level', 'email', 'profile_path', 'deleted_at'],
                paranoid: false
            },
            {
                model: models.User,
                through: models.CommentLike,
                as: 'likeUsers',
                attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'grade', 'level', 'email', 'profile_path', 'deleted_at'],
                paranoid: false
            },
            {
                model: models.Comment,
                as: 'children',
                include: [{
                    model: models.User,
                    required: true,
                    attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'grade', 'level', 'email', 'profile_path', 'deleted_at'],
                    paranoid: false
                },
                {
                    model: models.User,
                    through: models.CommentLike,
                    as: 'likeUsers',
                    attributes: ['user_id', 'user_uuid', 'nickname', 'introduction', 'grade', 'level', 'email', 'profile_path', 'deleted_at'],
                    paranoid: false
                }],
            }],
            where: {
                parent_id: parent_id,
                parent_comment_id: null
            },
            order: [['created_at'], ['children', 'created_at']]
        })
            .then((comments) => {
                resolve(comments)
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export function retrieveRecentComments() {
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

export function retrieveAllComments(grade, rowNum, offset) {
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


export function retrieveCommentsByUser(user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
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
                .then(function (posts) {
                    resolve(posts);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};


export function retrieveCommentsByUserUuid(user_uuid) {
    return new Promise((resolve, reject) => {
        if (!user_uuid) {
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
                .then(function (posts) {
                    resolve(posts);
                })
                .catch((err) => {
                    reject(err)
                })
        }
    })
};


export function createComment(user_id, parent_id, data) {
    return new Promise((resolve, reject) => {
        if (!user_id || !parent_id) {
            reject('id can not be null')
        }

        let comment_id = ''
        models.Comment.create({
            parent_id: parent_id,
            parent_comment_id: data.parent_comment_id ? data.parent_comment_id : null,
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

export function updateComment(comment_id, data) {
    return new Promise<void>((resolve, reject) => {
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

export function deleteComment(comment_id) {
    return new Promise<void>((resolve, reject) => {
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

