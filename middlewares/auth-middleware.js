const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const config = require('../config/config.js');

async function isAuth(req, res, next) {
  const token = req.cookies['Authorization']; // 쿠키에서 토큰 추출

  if (!token || !token.startsWith('Bearer')) {
    return res.status(400).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  try {
    const extractedToken = token.split(' ')[1]; // 'Bearer' 접두사 제거 후 토큰 추출
    const decoded = jwt.verify(extractedToken, config.jwt.secretKey); // 토큰 검증

    if (decoded) {
      const userId = decoded.user_id;
      const foundUser = await User.findByPk(userId);
      if (foundUser) {
        req.user = { user_id: foundUser.user_id }; // 유저 ID를 req.user에 저장
        next();
      } else {
        return res.status(400).json({ message: '존재하지 않는 회원입니다.' });
      }
    } else {
      return res.status(400).json({ message: '토큰이 유효하지 않습니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: '유효성 검증에 실패했습니다.' });
  }
}

module.exports = isAuth;
