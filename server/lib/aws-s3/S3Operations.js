const { PutObjectCommand } = require("@aws-sdk/client-s3");
const S3 = require("./config");
const KeyFactory = require("./KeysFactory");

const Bucket = process.env.AWS_BUCKET_NAME;

const S3Operations = {
  uploadProfileImage: async (userId, image) => {
    logger.trace(`[S3OPERATIONS] [UPLOAD PROFILE IMAGE] - Called`);
    const key = KeyFactory.genUserProfileKey(userId);
    const input = {
      Body: image.buffer,
      ContentType: image.mimetype,
      Bucket,
      Key: key,
    };

    const command = new PutObjectCommand(input);
    const data = await S3.send(command);

    if (data) {
      logger.trace(`[S3OPERATIONS] [UPLOAD PROFILE IMAGE] - Successfull`);
      return {
        key,
        meta: data.$metadata,
      };
    } else {
      logger.trace(`[S3OPERATIONS] [UPLOAD PROFILE IMAGE] - Unsuccessful`);
      return null;
    }
  },
  uploadCourseCover: async (courseId, image) => {
    const key = KeyFactory.genCourseCoverKey(courseId);
    const input = {
      Body: image.buffer,
      ContentType: image.mimetype,
      Bucket,
      Key: key,
    };

    const command = new PutObjectCommand(input);
    const data = await S3.send(command);

    if (data) {
      return {
        key,
        meta: data.$metadata,
      };
    } else {
      return null;
    }
  },
  listObjects: async () => {},
};

module.exports = S3Operations;
