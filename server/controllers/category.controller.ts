const models = require('../models');

export function retrieveCategoryByBoard(board_id) {
    return new Promise((resolve, reject) => {
        if (!board_id) {
            reject('id can not be null');
        }

        models.Category.findAll({
            where: { board_id: board_id }
        })
            .then((categories) => {
                resolve(categories);
            })
            .catch((err) => {
                reject(err);
            });
    })
}
