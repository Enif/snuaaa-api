'use strict';

var jwt = require('jsonwebtoken');

// JWT 토큰 생성
exports.createToken = function (payload) {
  var jwtOption = { expiresIn: '1d' };

  return new Promise(function (resolve, reject) {
    jwt.sign(payload, process.env.JWT_SECRET, jwtOption, function (error, token) {
      if (error) reject(error);
      resolve(token);
    });
  });
};

// JWT 토큰 검증
exports.verifyToken = function (token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};