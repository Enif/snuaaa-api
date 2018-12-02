const jwt = require('jsonwebtoken');

// JWT 토큰 생성
exports.createToken = payload => {
    const jwtOption = { expiresIn: '1d' };

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
};

exports.verifyTokenUseReq = req => {

  const auth = req.headers.authorization.split(" ");
  let token;

  if(auth[0] === 'Bearer') {
      token = auth[1]
  }
  else {
    return res.status(403).json({
      success: false,
      message: 'Token Type Error.'
    });
  }

  if (!token) {
      return res.status(403).json({
          success: false,
          message: 'Token does not exist.'
      });
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};