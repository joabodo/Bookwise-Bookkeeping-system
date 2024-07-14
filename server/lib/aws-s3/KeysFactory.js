const PATHS = require("./PATHS");

const KeyFactory = {
  genUserProfileKey: (userId) => PATHS.PUBLIC.USERS.PROFILE_IMAGES + userId,
  genCourseCoverKey: (courseId) => PATHS.PUBLIC.COURSES.COVER_IMAGES + courseId,
};

module.exports = KeyFactory;
