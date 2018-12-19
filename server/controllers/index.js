const db = require('./connection')


function signUp(userinfo, callback) {
    db.any(`INSERT INTO snuaaa."TB_ACCOUNT"(
        "USER_ID", "PASSWORD", "NAME", "AAA_NO",
        "NICKNAME", "SCHOOL_NO", "MAJOR", "EMAIL",
        "MOBILE", "INTRODUCTION", "PROFILE_PATH",
        "LEVEL", "CREATED")
        VALUES (
            ${userinfo.id}, ${userinfo.password}, ${userinfo.name}, ${userinfo.aaa_no},
            ${userinfo.nickname}, ${userinfo.school_no}, ${userinfo.major}, ${userinfo.email},
            ${userinfo.mobile}, ${userinfo.introduction}, ${userinfo.profile_path},
            ${userinfo.level}, ${userinfo.created});`)
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    });
}

module.exports = {
    signUp
};