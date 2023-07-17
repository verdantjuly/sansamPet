// user.repository.js 파일

const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

module.exports = {
  registerUser: async (nickname, password) => {
    const existingUser = await Users.findOne({ where: { nickname } });
    if (existingUser) {
      throw { status: 400, message: '중복된 닉네임입니다.' };
    }
    return Users.create({
      nickname,
      password,
    });
  },

  findUserByNickname: async nickname => {
    const user = await Users.findOne({ where: { nickname } });
    if (!user) {
      throw { status: 400, message: '존재하지 않는 닉네임입니다.' };
    }
    return user;
  },

  generateToken: (user, res) => {
    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    console.log(token);
    // 쿠키에 토큰 설정
    res.cookie('Authorization', `Bearer ${token}`);
  },

  logoutUser: async (req, res) => {
    // 토큰을 무효화하는 방식으로 로그아웃 구현
    res.cookie('Authorization', { expires: Date.now() });
  },
};
