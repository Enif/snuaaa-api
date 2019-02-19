const fs = require('fs');
const sharp = require('sharp');

<<<<<<< HEAD
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
=======
exports.resize = function(path) {

    fs.readFile(path, (err, data) => {
        if(err) {
            console.error(err);
        }
        else {
            sharp(data)
            .resize(300, 300)
            .toFile(path)
            .then((info) => {
                console.log('resize success')
                console.dir(info)
            })
            .catch((err) => {
                console.log('failed to resize')
            })
        }
    })
}
>>>>>>> 7d20a95879baca5e95f7d75607042c8a0689cd4f
