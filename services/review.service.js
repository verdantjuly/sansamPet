const ReviewsRepositories = require('../repositories/review.repository');

const { Reviews } = require('../models');

class ReviewsService {
  reviewsRepositories = new ReviewsRepositories();

  reviewPostService = async (content, petsitter_id, star, reservation_id) => {
    try {
      if (!content || !petsitter_id || !star) {
        return {
          status: 400,
          message: '미입력된 항목이 있습니다. 모두 입력하여 주세요.',
        };
      }
      const post = await this.reviewsRepositories.reviewPostRepository(
        content,
        petsitter_id,
        star,
        reservation_id,
      );
      if (post) {
        return { status: 200, message: '게시물 작성에 성공하였습니다.' };
      }
    } catch (err) {
      return { status: 400, message: '게시물 작성에 실패하였습니다.' };
    }
  };

  getAllReviewService = async () => {
    const allPost = await this.reviewsRepositories.getAllReviewRepository();
    if (allPost && !allPost[0]) {
      return {
        status: 200,
        message: '게시물이 없습니다. 첫 작성자가 되어 주세요.',
        allPost: null,
      };
      // 내용물이 있다면, 성공 메시지.
    } else if (allPost) {
      return { status: 200, message: '게시글 조회에 성공하였습니다.', allPost };
      // 아니면 실패 메시지
    } else {
      return {
        status: 400,
        message: '게시물 조회에 실패하였습니다.',
        allPost: null,
      };
    }
  };

  reviewUpdateService = async (content, user_id, review_id, star) => {
    try {
      if (!content || !star) {
        return {
          status: 400,
          message: '미입력된 항목이 있습니다. 모든 항목을 입력해 주세요.',
        };
      }
      const target = await Reviews.findOne({ where: { review_id, user_id } });
      if (!target) {
        return { status: 400, message: '수정 게시글 조회에 실패하였습니다.' };
      }
      const post = await this.reviewsRepositories.reviewUpdateRepository(
        content,
        user_id,
        review_id,
        star,
      );
      if (post) {
        return { status: 200, message: '게시물 수정에 성공하였습니다.' };
      } else {
        return { status: 400, message: '게시물 수정에 실패하였습니다.' };
      }
    } catch (err) {
      return { status: 400, message: '게시글 수정 실패' };
    }
  };
  reviewDeleteService = async (isDelete, review_id, user_id) => {
    try {
      if (isDelete === false) {
        return {
          status: 400,
          message: '본인 요청으로 삭제 취소',
        };
      }
      const target = await Reviews.findOne({ where: { review_id, user_id } });
      if (!target) {
        return { status: 400, message: '삭제 게시글 조회에 실패하였습니다.' };
      }
      const post = await this.reviewsRepositories.reviewDeleteRepository(
        review_id,
      );
      if (post) {
        return { status: 200, message: '게시물 삭제에 성공하였습니다.' };
      } else {
        return { status: 400, message: '게시물 삭제에 실패했습니다..' };
      }
    } catch (err) {
      return { status: 400, message: '게시글 수정 실패' };
    }
  };
}

module.exports = ReviewsService;
