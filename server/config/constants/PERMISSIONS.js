const PERMISSIONS = {
  CREATE: {
    COURSE: "create_course",
    ADMIN: "create_admin",
    MODULE: "create_module",
  },
  READ: {
    ADMIN: "read_admin",
    FEEDBACK: "read_feedback",
    USER: "read_user",
  },
  UPDATE: {
    COURSE: "update_course",
    ADMIN: "update_admin",
    MODULE: "update_module",
    ROLE: "update_role",
  },
  PUBLISH: {
    COURSE: "publish_course",
    MODULE: "pubish_module",
  },
  UPLOAD: {
    PROFILE_PICTURE: "upload_profile_picture",
    COURSE_IMAGE: "upload_course_image",
  },
  DELETE: {
    COURSE: "delete_course",
    ADMIN: "delete_admin",
    MODULE: "delete_module",
  },
};

module.exports = PERMISSIONS;
