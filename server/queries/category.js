const db = require('./connection')

exports.retrieveCategories = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT category_id, category_name, category_color
                FROM snuaaa.tb_category
                WHERE board_id = $1
                ;
            `;
            db.any(query, board_id)
            .then(function(categories){
                resolve(categories);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
};