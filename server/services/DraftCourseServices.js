const {
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
} = require("../config/constants/PAGINATION");
const logger = require("../lib/logger");
const Course = require("../models/Course");
const DraftCourse = require("../models/DraftCourse");
const flattenObj = require("../utils/flattenObject");

// TODO: Add documentation
exports.createDraftCourse = async (course, config = {}) => {
  logger.trace(`[COURSE SERVICE] [CREATE COURSE] - Called`);
  try {
    const result = await DraftCourse.create([course], {
      session: config?.session,
    });
    const newCourse = result[0];
    logger.trace(`[COURSE SERVICE] [CREATE COURSE] - Completed`);
    return newCourse;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [CREATE USER] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.getDraftCourses = async (query, config = {}) => {
  const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, session = null } = config;
  logger.trace(`[DRAFT COURSE SERVICE] [GET DRAFT COURSES] - Called`);
  limit = Math.min(limit, MAX_PAGINATION_LIMIT);
  const skip = (page - 1) * limit;
  try {
    const data = await DraftCourse.find(query)
      .sort()
      .limit(limit)
      .skip(skip)
      .populate("cover")
      .populate("category")
      .lean()
      .session(session);
    const count = await DraftCourse.count();
    const docsLeft = count - page * limit;
    const result = {
      data,
      pagination: {
        hasMore: docsLeft > 0,
        currPage: page,
        limit: limit,
      },
    };
    logger.trace(`[COURSE SERVICE] [GET COURSES] - Completed`);
    return result;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [GET COURSES] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentaion
exports.getDraftCourseByQuery = async (query, config = {}) => {
  logger.trace(`[COURSE SERVICE] [GET COURSE] - Called`);
  try {
    const course = await DraftCourse.findOne(query)
      .populate("cover")
      .populate("category")
      .lean()
      .session(config?.session);
    if (!course) {
      logger.debug(
        `[COURSE SERVICE] [GET COURSE] - No course matched the query`
      );
    } else {
      logger.debug(`[COURSE SERVICE] [GET COURSE] - Course found`);
    }
    logger.trace(`[COURSE SERVICE] [GET COURSE] - Completed`);
    return course;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [GET COURSE] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.getDraftCourseById = async (id, config = {}) => {
  logger.trace(`[COURSE SERVICE] [GET COURSE BY ID] - Called`);
  try {
    const course = DraftCourse.findById(id)
      .populate("cover")
      .populate("category")
      .lean()
      .session(config?.session);
    if (!course) {
      logger.debug(
        `[COURSE SERVICE] [GET COURSE] - No course with matching ID`
      );
    } else {
      logger.debug(`[COURSE SERVICE] [GET COURSE] - Course found`);
    }
    logger.trace(`[COURSE SERVICE] [GET COURSE] - Completed`);
    return course;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [GET COURSE BY ID] - Encountered an error\n${error}`
    );
  }
};

exports.draftCourseExists = async (query, config = {}) => {
  logger.trace(`[COURSE SERVICE] [COURSE EXISTS] - Called`);

  try {
    const exists = await Course.exists(query).session(config?.session);
    logger.debug(
      `[COURSE SERVICE] [COURSE EXISTS] - ${
        exists ? "Course Exists" : "Course doesn't exists"
      }`
    );
    logger.trace(`[COURSE SERVICE] [COURSE EXISTS] - Completed`);
    return exists;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [COURSE EXISTS] - Encountered an error\n${error}`
    );
  }
};

// TODO: Add documentation
exports.patchDraftCourse = async (id, data, config = {}) => {
  logger.trace(`[COURSE SERVICE] [PATCH COURSE] - Called`);

  const flatData = flattenObj(data);
  try {
    const patchedCourse = await Course.findByIdAndUpdate(id, flatData, {
      runValidators: true,
      new: true,
    })
      .populate("cover")
      .populate("category")
      .lean()
      .session(config?.session);
    logger.trace(`[COURSE SERVICE] [PATCH COURSE] - Completed`);
    return patchedCourse;
  } catch (error) {
    throw new Error(
      `[COURSE SERVICE] [PATCH COURSE] - Encountered an error\n${error}`
    );
  }
};
