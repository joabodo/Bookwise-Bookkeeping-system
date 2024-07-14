const multer = require("multer");
const FILES = require("../../config/constants/FILES.js");
const STATUS_CODES = require("../../config/constants/STATUS_CODES.js");
const logger = require("../../lib/logger.js");

const upload = multer({
  limits: {
    fileSize: FILES.IMAGES.PROFILE_IMAGE.MAX_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (FILES.IMAGES.ACCEPTED_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    const err = new multer.MulterError();
    err.message = "Unsupported file type";
    return cb(err, false);
  },
}).single("profileImage");

const parseProfileImageUpload = (req, res, next) => {
  logger.trace(`[MIDDLEWARE] [MULTER] [PROFILE IMAGE UPLOAD] - CALLED`);
  return upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      logger.debug(
        err,
        "[MIDDLEWARE] [MULTER] [PROFILE IMAGE UPLOAD] - Multer Error"
      );
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: true, message: err.message });
    } else if (err) {
      logger.error(
        err,
        "[MIDDLEWARE] [MULTER] [PROFILE IMAGE UPLOAD] - Encountered an Error"
      );
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send("INTERNAL SERVER ERROR");
    }
    logger.trace(`[MIDDLEWARE] [MULTER] [PROFILE IMAGE UPLOAD] - Passed`);
    logger.trace(
      `[MIDDLEWARE] [MULTER] [PROFILE IMAGE UPLOAD] - Called next()`
    );
    next();
  });
};

module.exports = parseProfileImageUpload;
