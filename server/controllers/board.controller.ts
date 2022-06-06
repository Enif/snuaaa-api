const models = require('../models');
import { Op } from 'sequelize';

export function retrieveBoard(board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Board.findOne({
            include: [{
                model: models.Tag,
                as: 'tags'
            }, {
                model: models.Category,
                as: 'categories'
            }],
            where: { board_id: board_id }
        })
            .then((board) => {
                if (!board) {
                    reject('id is not correct');
                }
                else {
                    resolve(board);
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
}

export function retrieveBoards() {
    return new Promise((resolve, reject) => {

        models.Board.findAll({
        })
            .then((boards) => {
                resolve(boards);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

export function retrieveBoardsCanAccess(grade) {
    return new Promise((resolve, reject) => {

        models.Board.findAll({
            include: [{
                model: models.Tag,
                as: 'tags'
            }, {
                model: models.Category,
                as: 'categories'
            }],
            where: {
                lv_read: {
                    [Op.gte]: grade
                }
            },
            order: [
                ['menu', 'ASC'],
                ['order', 'ASC']
            ]
        })
            .then((boards) => {
                resolve(boards);
            })
            .catch((err) => {
                reject(err);
            });
    })
}