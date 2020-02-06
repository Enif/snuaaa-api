const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

exports.resizeForThumbnail = function (file_path, type) {

    return new Promise((resolve, reject) => {

        const baseName = path.join(path.dirname(file_path), path.basename(file_path, path.extname(file_path)));

        try {
            const buf = fs.readFileSync(file_path);
            const image = sharp(buf);
            
            image.rotate().metadata()
            .then(function (metadata) {
                // resizing by long axis
                if(type === 'P') {
                    if(metadata.orientation >= 5 && metadata.orientation <= 8) {
                        if (metadata.height > metadata.width) {
                            return Promise.all([
                                image.resize({ width: 1920 }).toFile(file_path),
                                image.resize({ width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`),
                            ])
                        }
                        else {
                            return Promise.all([
                                image.resize({ height: 1920 }).toFile(file_path),
                                image.resize({ height: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`)
                            ])
                        }
                    }
                    else {
                        if (metadata.height > metadata.width) {
                            return Promise.all([
                                image.resize({ height: 1920 }).toFile(file_path),
                                image.resize({ height: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`),
                            ])
                        }
                        else {
                            return Promise.all([
                                image.resize({ width: 1920 }).toFile(file_path),
                                image.resize({ width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`)
                            ])
                        }
                    }
                }
                else {
                    if(metadata.orientation >= 5 && metadata.orientation <= 8) {
                        if (metadata.height > metadata.width) {
                            return Promise.all([
                                image.resize({ width: 1920 }).toFile(file_path),
                                image.resize({ height:300, width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`),
                            ])
                        }
                        else {
                            return Promise.all([
                                image.resize({ height: 1920 }).toFile(file_path),
                                image.resize({ height:300, width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`)
                            ])
                        }
                    }
                    else {
                        if (metadata.height > metadata.width) {
                            return Promise.all([
                                image.resize({ height: 1920 }).toFile(file_path),
                                image.resize({ height:300, width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`),
                            ])
                        }
                        else {
                            return Promise.all([
                                image.resize({ width: 1920 }).toFile(file_path),
                                image.resize({ height:300, width: 300 }).jpeg().toFile(`${baseName}_thumb.jpeg`)
                            ])
                        }
                    }
                }
            })
            .then(() => {
                resolve(`${baseName}_thumb.jpeg`);
            })
            .catch(function (err) {
                reject(err)
            });

        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};


exports.resize = function (file_path) {

    return new Promise((resolve, reject) => {

        fs.readFile(file_path, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                const image = sharp(data)
                image.rotate().metadata()
                    .then(function (metadata) {
                        // resizing by minor axis
                        if(metadata.orientation >= 5 && metadata.orientation <= 8) {
                            if (metadata.height > metadata.width) {
                                return image.resize({ height:300 }).toFile(file_path)
                            }
                            else {
                                return image.resize({ width: 300 }).toFile(file_path)
                            }
                        }
                        else {
                            if (metadata.height > metadata.width) {
                                return image.resize({ width: 300 }).toFile(file_path)
                            }
                            else {
                                return image.resize({ height: 300 }).toFile(file_path)
                            }
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

exports.resizeAttatchedImg = function (file_path) {

    return new Promise((resolve, reject) => {

        fs.readFile(file_path, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                const image = sharp(data)
                image.rotate().metadata()
                    .then(function (metadata) {
                        // resizing by minor axis
                        if(metadata.orientation >= 5 && metadata.orientation <= 8) {
                            if (metadata.height > metadata.width) {
                                return image.resize({ height:720 }).toFile(file_path)
                            }
                            else {
                                return image.resize({ width: 720 }).toFile(file_path)
                            }
                        }
                        else {
                            if (metadata.height > metadata.width) {
                                return image.resize({ width: 720 }).toFile(file_path)
                            }
                            else {
                                return image.resize({ height: 720 }).toFile(file_path)
                            }
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
