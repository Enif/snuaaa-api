const models = require('../models');

exports.deleteFile = function (file_id) {
    return new Promise((resolve, reject) => {
        if (!file_id) {
            reject('file_id can not be null')
        }
        else {
            models.AttachedFile.destroy({
                where: {
                    file_id: file_id
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
