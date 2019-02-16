const fs = require('fs');
const sharp = require('sharp');

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