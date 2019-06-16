const models = require('../models');

exports.retrieveBoard = function (board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Board.findOne({
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

exports.retrieveBoards = function () {
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