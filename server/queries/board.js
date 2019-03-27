const db = require('./connection')

exports.retrieveBoardInfo = function(board_id) {
    return new Promise((resolve, reject) => {
        if(!board_id) {
            reject();
        }
        else {
            let query = `
                SELECT board_name, board_type, lv_read, lv_write, lv_edit
                FROM snuaaa.tb_board
                WHERE board_id = $1;
            `;
            db.one(query, board_id)
            .then(function(boardInfo){
                resolve(boardInfo);    
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            })
        }
    })
};