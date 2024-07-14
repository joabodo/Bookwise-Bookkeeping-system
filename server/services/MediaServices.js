const Media = require("../models/Media");
const logger = require("../lib/logger");

// TODO: Add documentation
exports.createMedia = async (media, config = {}) => {
  logger.trace(`[MEDIA SERVICE] [CREATE MEDIA] - Called`);

  try {
    const result = await Media.create([media], { session: config?.session });
    const newMedia = result[0] || null;
    logger.trace(`[MEDIA SERVICE] [CREATE MEDIA] - Completed`);
    return newMedia;
  } catch (error) {
    throw new Error(
      `[MEDIA SERVICE] [CREATE MEDIA] - Encountered an error \n ${error}`
    );
  }
};

// TODO: Add documentation
exports.upsertMedia = async (key, mediaData, config = {}) => {
  logger.trace(`[MEDIA SERVICE] [UPSERT MEDIA] - Called`);

  try {
    const media = await Media.findOneAndUpdate({ key }, mediaData, {
      runValidators: true,
      upsert: true,
      new: true,
    })
      .lean()
      .session(config?.session);
    logger.trace(`[MEDIA SERVICE] [UPSERT MEDIA] - Completed`);
    return media;
  } catch (error) {
    throw new Error(
      `[MEDIA SERVICE] [UPSERT MEDIA] - Encountered an error \n ${error}`
    );
  }
};
