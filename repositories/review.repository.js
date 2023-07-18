const { Reviews } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

class ReviewsRepositories {
  reviewPostRepository = async (content, petsitterId, star, reservationId) => {
    console.log('게시시작');
    try {
      const post = await Reviews.create({
        content,
        userId: 1,
        reservationId,
        petsitterId,
        star,
      });
      console.log('게시성공');
      return post;
    } catch (error) {
      console.error('게시 실패:', error.message);
      throw error; // 올바른 오류 핸들링을 위해 오류를 다시 던집니다.
    }
  };

  getAllReviewRepository = async postId => {
    // 쿼리 문법을 직접 입력해서 가져온다.
    const post = await sequelize.query(
      `SELECT * FROM sansam.Reviews LIMIT 30;`,
      { type: QueryTypes.SELECT },
    );
    // 내보낸다.
    return post;
  };

  reviewUpdateRepository = async (content, userId, reviewId, star) => {
    const post = await Reviews.update(
      {
        userId,
        content,
        reviewId,
        star,
      },
      { where: { reviewId } },
    );
    // 내보낸다.
    return post;
  };

  reviewDeleteRepository = async reviewId => {
    const post = await Reviews.destroy({ where: { reviewId } });
    // 내보낸다.
    return post;
  };
}

module.exports = ReviewsRepositories;
