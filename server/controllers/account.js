const db = require('./connection')
import bcrypt from 'bcryptjs'

exports.duplicateCheck = function(user_id) {
    return new Promise((resolve, reject) => {
        if(!user_id) {
            reject();
        }

        let query = `SELECT EXISTS(
            SELECT _id
            FROM snuaaa.tb_user
            WHERE user_id = $1
            )`;

        db.any(query, [user_id])
        .then((isUser) => {
            console.log(isUser)
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
        console.log(userinfo)

        if(!userinfo.id) {
            console.log('Id can not be null')
            reject()
        }
        
        let query = `INSERT INTO snuaaa."tb_user"(
            "user_id", "password", "name", "aaa_no",
            "nickname", "col_no", "major", "email",
            "mobile", "introduction", "profile_path",
            "level", "created_at") 
            VALUES (
                $<id>, $<password>, $<username>, $<aaaNum>,
                $<nickname>, $<schoolNum>, $<major>, $<email>,
                $<mobile>, $<introduction>, $<profile_path>,
                $<level>, $<created>)`; 

        let password = bcrypt.hashSync(userinfo.password, 8)
        let nickname = userinfo.aaaNum ? (userinfo.aaaNum.substring(0,2) + userinfo.username) : userinfo.username;
        let level = userinfo.aaaNum ? 8 : 9;
        let created = new Date()

        
        let data = {
            id: userinfo.id,
            password: password, 
            username: userinfo.username,
            aaaNum: userinfo.aaaNum, 
            nickname: nickname,
            schoolNum: userinfo.schoolNum, 
            major: userinfo.major, 
            email: userinfo.email,
            mobile: userinfo.mobile, 
            introduction: userinfo.introduction, 
            profile_path: userinfo.profile_path,
            level: level, 
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

exports.logIn = function(logInInfo) {
    return new Promise((resolve, reject) => {

        if(!logInInfo.id || !logInInfo.password) {
            console.log('Id can not be null')
            reject()
        }
        
        let query = `SELECT _id, user_id, password
        FROM snuaaa.tb_user
        WHERE user_id = $1`;
        
        db.one(query, logInInfo.id)
        .then((userInfo) => {
            if(bcrypt.compareSync(logInInfo.password, userInfo.password)) {
                resolve(userInfo._id);
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

exports.retrieveInfo = function(_id) {
    console.log('hihihihih')
    return new Promise((resolve, reject) => {

        if(!_id) {
            console.log('Id can not be null')
            reject()
        }
        
        let query = `SELECT user_id, name, aaa_no, col_no, major, email, mobile, introduction, level, created_at, profile_path
        FROM snuaaa.tb_user
        WHERE _id = $1`;

        db.one(query, _id)
        .then((userInfo) => {
            console.log('then....')
            resolve(userInfo)
        })
        .catch((err) => {
            console.log('catch....')
            reject(err);
        })
    })
}