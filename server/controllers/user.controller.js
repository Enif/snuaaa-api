const models = require('../models');
const uuid4 = require('uuid4');
const Op = models.Sequelize.Op;

exports.createUser = function (userData) {

    return new Promise((resolve, reject) => {

        models.User.create({
            user_uuid: uuid4(),
            id: userData.id,
            password: userData.password,
            username: userData.username,
            nickname: userData.nickname,
            aaa_no: userData.aaa_no,
            col_no: userData.col_no,
            major: userData.major,
            email: userData.email,
            mobile: userData.mobile,
            introduction: userData.introduction,
            profile_path: userData.profile_path,
            grade: userData.grade,
            level: userData.level
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
            reject('user_id can not be null');
        }

        models.User.findOne({
            attributes: ['user_id', 'id', 'username', 'nickname', 'aaa_no',
                'col_no', 'major', 'email', 'mobile', 'introduction', 'grade', 'level', 'profile_path', 'login_at'],
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

exports.retrieveUserPw = function (user_id) {
    return new Promise((resolve, reject) => {
        if (!user_id) {
            reject('user_id can not be null');
        }

        models.User.findOne({
            attributes: ['password'],
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


exports.retrieveUserByUserUuid = function (user_uuid) {
    return new Promise((resolve, reject) => {
        if (!user_uuid) {
            reject('user_uuid can not be null');
        }

        models.User.findOne({
            attributes: ['user_id', 'id', 'username', 'nickname', 'aaa_no',
                'col_no', 'major', 'email', 'mobile', 'introduction', 'grade', 'level', 'profile_path'],
            where: { user_uuid: user_uuid }
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


exports.retrieveUsersByEmailAndName = function (email, username) {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject('email can not be null');
        }

        models.User.findAll({
            attributes: ['id'],
            where: { email: email, username: username }
        })
            .then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.retrieveUsersByName = function (username) {
    return new Promise((resolve, reject) => {
        models.User.findAll({
            attributes: ['user_uuid', 'username', 'nickname', 'profile_path'],
            where: { username: { [Op.like]: `%${username}%` } },
            limit: 5
        })
            .then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

exports.retrieveUserById = function (id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject('id can not be null');
        }

        models.User.findOne({
            attributes: ['user_id', 'user_uuid', 'id', 'password',
            'username', 'nickname', 'grade', 'level', 'email', 'profile_path', 'login_at'],
            where: { id: id }
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
            reject('user_id can not be null');
        }

        models.User.update({
            username: data.username,
            nickname: data.nickname,
            aaa_no: data.aaa_no,
            col_no: data.col_no,
            major: data.major,
            email: data.email,
            mobile: data.mobile,
            introduction: data.introduction,
            grade: data.grade,
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


exports.updateUserPw = function (user_id, password) {
    return new Promise((resolve, reject) => {

        if (!user_id) {
            reject('user_id can not be null');
        }
        else if (!password) {
            reject('password can not be null');
        }
        else {
            models.User.update({
                password: password
            }, {
                where: { user_id: user_id }
            })
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    reject(err);
                })
        }
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
            },
            silent: true
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
