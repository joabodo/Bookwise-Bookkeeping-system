const DEFAULT_MAX_SIZE = 1 * 1024 * 1024; // 1 MiB

const FILES = {
  IMAGES: {
    ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    GLOBAL_MAX_SIZE: DEFAULT_MAX_SIZE,
    PROFILE_IMAGE: {
      MAX_SIZE: 600 * 1024, //600 KiB
    },
    COURSE_COVER_IMAGE: {
      MAX_SIZE: DEFAULT_MAX_SIZE,
    },
  },
};

module.exports = FILES;
