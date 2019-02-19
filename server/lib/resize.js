const fs = require('fs');
const sharp = require('sharp');

exports.resize = function (path) {
    console.log('[resize]path ', path);
    fs.readFile(path, function (err, data) {
        console.log('[resize]err ', err);
        if (err) {
            console.log('[resize]err ', err);
        } else {
            const image = sharp(data)

            image.metadata()
            .then(function(metadata) {
                console.log('meta >> ', metadata);
                if(metadata.size > 1024 * 1024) {
                    if(metadata.height > metadata.width) {
                        return image.resize({ width : 720}).toFile(path)
                    }
                    else {
                        return image.resize({ height : 720}).toFile(path)
                    }
                }
                else return;
            })
            .then(function (info) {
                console.log('resize success');
                console.dir(info);
            }).catch(function (err) {
                console.log('failed to resize');
            });
        }
    });
};