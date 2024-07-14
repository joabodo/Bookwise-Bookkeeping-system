const { z } = require("zod");
const mongoose = require("mongoose");
const ROLES = require("../config/constants/ROLES");
const COUNTRY_LIST_ALPHA3 = require("../config/constants/COUNTRY_LIST_ALPHA3");

const country = z.enum(Object.keys(COUNTRY_LIST_ALPHA3), {
  invalid_type_error: "Not a valid ISO 3166 Alpha-3 Country Format",
});

const boolean = z
  .boolean()
  .or(z.enum(["true", "false"]).transform((val) => val === "true"));

const role = z.enum(
  ROLES.map((role) => role.name),
  {
    invalid_type_error: "Invalid role",
  }
);

const ObjectIdSchema = z
  .string()
  .refine(mongoose.Types.ObjectId.isValid, "Invalid Object ID");

module.exports = { country, boolean, role, ObjectIdSchema };
