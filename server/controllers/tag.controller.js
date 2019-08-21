const models = require('../models');


exports.retrieveTagsOnBoard = function (board_id) {
    return new Promise((resolve, reject) => {

        if (!board_id) {
            reject('id can not be null');
        }

        models.Tag.findAll({
            where: { board_id: board_id },
            order: [['tag_type', 'ASC'], ['tag_id', 'ASC']]
        })
            .then((tags) => {
                resolve(tags);
            })
            .catch((err) => {
                reject(err)
            })
    })
};
