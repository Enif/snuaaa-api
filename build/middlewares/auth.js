'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * TODO : Token 라이브러리화 검토
 */

/* const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware */

var _require = require('../lib/token'),
    verifyToken = _require.verifyToken;

exports.isAuthenticated = function (req, res, next) {
    // 토큰 취득
    var token = req.body.token || req.query.token || req.headers.authorization;
    // const token = req.body.token || req.query.token || req.headers.authorization.split(' ')[1];

    // 토큰 미존재: 로그인하지 않은 사용자
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token does not exist.'
        });
    }

    // 토큰 검증
    verifyToken(token).then(function (decodedToken) {
        req.decodedToken = decodedToken;
        next();
    }).catch(function (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    });
};

exports.default = isAuthenticated;
//module.exports = isAuthenticated


/* const jwt = require('jsonwebtoken');

// JWT 토큰 생성
exports.createToken = payload => {
  const jwtOption = { expiresIn: '7d' };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, jwtOption, (error, token) => {
      if (error) reject(error);
      resolve(token);
    });
  });
};

// JWT 토큰 검증
exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}; */