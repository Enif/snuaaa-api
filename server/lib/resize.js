const fs = require('fs');
const sharp = require('sharp');

exports.resize = function (path) {

    return new Promise((resolve, reject) => {

        fs.readFile(path, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                const image = sharp(data)
                image.metadata()
                .then(function(metadata) {
                    if(metadata.size > 1024 * 1024) {
                        if(metadata.height > metadata.width) {
                            return image.resize({ width : 720}).toFile(path)
                        }
                        else {
                            return image.resize({ height : 720}).toFile(path)
                        }
                    }
                    else {
                        resolve();   
                    }
                })
                .then(function (info) {
                    resolve(info);
                })
                .catch(function (err) {
                    reject(err)
                });
            }
        });
    });
};
