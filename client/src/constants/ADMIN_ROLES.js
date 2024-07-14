export const ADMIN_ROLES = {
  MASTER: "master",
  ADMIN: "admin",
  EDITOR: "editor",
};

export default Object.keys(ADMIN_ROLES).map((key) => ADMIN_ROLES[key]);
