const models = require('../models');
import { resize } from '../lib/resize';
import bcrypt from 'bcryptjs'

exports.createUser = function (req) {

    let profilePath;
    if (req.file) {
        profilePath = '/profile/' + req.file.filename;
        resize(req.file.path)
    }

    let nickname = '';

    if (req.body.aaaNum) {
        if ((/^[0-9]{2}[Aa]{3}-[0-9]{1,3}$/).test(req.body.aaaNum)) {
            // 00AAA-000
            nickname = req.body.aaaNum.substr(0, 2) + req.body.username;
        }
        else if ((/^[Aa]{3}[0-9]{2}-[0-9]{1,3}$/).test(req.body.aaaNum)) {
            // AAA00-000
            nickname = req.body.aaaNum.substr(3, 2) + req.body.username;
        }
        else {
            nickname = req.body.username;
            req.body.aaaNum = null;
        }
    }

    let level = req.body.aaaNum ? 2 : 1;

    return new Promise((resolve, reject) => {

        if (!req.body.id) {
            reject('id can not be null')
        }

        models.User.create({
            id: req.body.id,
            password: bcrypt.hashSync(req.body.password, 8),
            username: req.body.username,
            nickname: nickname,
            aaa_no: req.body.aaaNum,
            col_no: req.body.schoolNum,
            major: req.body.major,
            email: req.body.email,
            mobile: req.body.mobile,
            introduction: req.body.introduction,
            profile_path: profilePath,
            level: level
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.retrieveUser = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('id can not be null');
        }

        models.User.findOne({
            attributes: ['user_id', 'id', 'username', 'nickname', 'aaa_no',
                'col_no', 'major', 'email', 'mobile', 'introduction', 'level', 'profile_path'],
            where: { user_id: user_id }
        })
            .then((user) => {
                if (!user) {
                    reject('id is not correct');
                }
                else {
                    resolve(user);
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.updateUser = function (user_id, data) {
    return new Promise((resolve, reject) => {

        if (!user_id) {
            reject('id can not be null');
        }

        models.User.update({
            user_id: user_id,
            username: data.username,
            nickname: data.nickname,
            aaa_no: data.aaa_no,
            col_no: data.col_no,
            major: data.major,
            email: data.email,
            mobile: data.mobile,
            introduction: data.introduction,
            level: data.level,
            profile_path: data.profile_path,
        }, {
                where: { user_id: user_id }
            })
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err);
            })
    })
}

exports.deleteUser = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('id can not be null')
        }

        models.User.destroy(
        {
            where: {
                user_id: user_id
            }    
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}



exports.loginUser = function (req) {
    return new Promise((resolve, reject) => {
        if (!req.body.id) {
            reject('id can not be null');
        }

        let userInfo = {};

        models.User.findOne({
            where: { id: req.body.id }
        })
            .then((user) => {
                return new Promise((resolve, reject) => {
                    if (!user) {
                        reject('id is not correct');
                    }
                    else if (bcrypt.compareSync(req.body.password, user.password)) {
                        userInfo = user;
                        resolve();
                    }
                    else {
                        reject('password is not correct');
                    }
                })
            })
            .then(() => {
                resolve(userInfo)
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.updateLoginDate = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('id can not be null');
        }

        models.User.update({
            login_at: new Date()
        }, {
                where: {
                    user_id: user_id
                }
            }
        )
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.checkDupId = function (id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject('id can not be null');
        }

        models.User.findOne({
            where: { id: id }
        })
            .then((user) => {
                if (user) {
                    reject();
                }
                else {
                    resolve();
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
}
