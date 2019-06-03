const db = require('./connection')
import bcrypt from 'bcryptjs'

exports.duplicateCheck = function(id) {
    return new Promise((resolve, reject) => {
        if(!id) {
            reject();
        }

        let query = `SELECT EXISTS(
            SELECT user_id
            FROM snuaaa.tb_user
            WHERE id = $1
            )`;

        db.any(query, [id])
        .then((isUser) => {
            if(!isUser || !isUser[0]){
                reject();
            }
            if(!isUser[0].exists){
                resolve();
            }
            else {
                reject();
            }
        })
        .catch((err) => {
            reject(err);
        });
    })
};

exports.signUp = function(userinfo) {
    return new Promise((resolve, reject) => {

        if(!userinfo.id) {
            reject('id can not be null')
        }
        
        let query = `INSERT INTO snuaaa.tb_user(
            id, password, name, aaa_no, nickname, col_no, major, email,
            mobile, introduction, profile_path, level, created_at) 
            VALUES (
                $<id>, $<password>, $<username>, $<aaaNum>,
                $<nickname>, $<schoolNum>, $<major>, $<email>,
                $<mobile>, $<introduction>, $<profile_path>,
                $<level>, $<created>)`; 

        let created = new Date()
        
        let data = {
            id: userinfo.id,
            password: userinfo.password, 
            username: userinfo.username,
            aaaNum: userinfo.aaaNum, 
            nickname: userinfo.nickname,
            schoolNum: userinfo.schoolNum, 
            major: userinfo.major, 
            email: userinfo.email,
            mobile: userinfo.mobile, 
            introduction: userinfo.introduction, 
            profile_path: userinfo.profile_path,
            level: userinfo.level, 
            created: created
        };
            
        db.any(query, data)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })   
}

exports.retrieveLoginInfo = function(logInInfo) {
    return new Promise((resolve, reject) => {

        if(!logInInfo.id || !logInInfo.password) {
            reject('id can not be null')
        }
        
        let query = `SELECT user_id, password, nickname, level, profile_path
        FROM snuaaa.tb_user
        WHERE id = $1`;
        
        db.one(query, logInInfo.id)
        .then((userInfo) => {
            if(bcrypt.compareSync(logInInfo.password, userInfo.password)) {
                resolve(userInfo);
            }
            else{
                reject();
            }
        })
        .catch((err) => {
            reject(err);
        });
    })   
}

exports.retrieveInfo = function(user_id) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            reject('id can not be null');
        }
        
        let query = `SELECT user_id, id, name, nickname, aaa_no, col_no, major, email, mobile, introduction, level, created_at, profile_path
        FROM snuaaa.tb_user
        WHERE user_id = $1`;

        db.one(query, user_id)
        .then((userInfo) => {
            resolve(userInfo)
        })
        // .catch((err)=> console.error(err));
        .catch((err) => {
            reject(err);
        })
    })
}

exports.updateUser = function(user_id, data) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            reject('id can not be null');
        }

        let query = `
        UPDATE snuaaa.tb_user
        SET name=$<name>,
        aaa_no=$<aaa_no>,
        nickname=$<nickname>,
        col_no=$<col_no>,
        major=$<major>,
        email=$<email>,
        mobile=$<mobile>,
        introduction=$<introduction>,
        level=$<level>,
        updated_at=$<updated_at>,
        profile_path=$<profile_path>
        WHERE user_id=$<user_id>;
        `;

        let updated_at = new Date();
    
        let queryData = {
            user_id: user_id,
            name: data.name,
            nickname: data.nickname,
            aaa_no: data.aaa_no,
            col_no: data.col_no,
            major: data.major,
            email: data.email,
            mobile: data.mobile,
            introduction: data.introduction,
            level: data.level,
            profile_path: data.profile_path,
            updated_at: updated_at
        }

        db.any(query, queryData)
        .then(() => {
            resolve()
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.updateLoginDate = function(user_id) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            reject('id can not be null');
        }
        
        let query = `
        UPDATE snuaaa.tb_user
        SET login_at=$<login_at>
        WHERE user_id=$<user_id>;
        `;

        let login_at = new Date();
    
        let queryData = {
            user_id: user_id,
            login_at: login_at
        }

        db.any(query, queryData)
        .then(() => {
            resolve()
        })
        .catch((err) => {
            reject(err);
        })
    })
}

exports.dropUser = function(user_id) {
    return new Promise((resolve, reject) => {

        if(!user_id) {
            reject('Id can not be null');
        }

        let query = `
            DELETE FROM snuaaa.tb_user
            WHERE user_id = $1;
        `;

        db.none(query, user_id)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })

    })

}