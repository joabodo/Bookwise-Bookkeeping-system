const { z } = require("zod");
const MEDIA_PROVIDERS = require("../config/constants/MEDIA_PROVIDERS");
const MEDIA_TYPES = require("../config/constants/MEDIA_TYPES");
const { lowerCase } = require("lodash");
const REGEX = require("../config/constants/REGEX");

// TODO: Add documentation

const refineSchema = (schema) =>
  schema.refine((data) => (data.provider != "mux") === !data.meta.muxAssestId, {
    path: ["meta.muxAssetId"],
    message: "muxAssetId meta is required when provider is set to 'mux'",
  });

const MediaSchema = z.object({
  key: z
    .string()
    .trim()
    .refine(
      (val) => !REGEX.WHITESPACE.test(val),
      "Media Key cannot contain whitespace"
    ),
  type: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => MEDIA_TYPES.includes(val), "Unsupported Media Type"),
  }),
  provider: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (val) => MEDIA_PROVIDERS.includes(val),
        "Unsupported Media Provider"
      ),
  }),
  meta: z.object(),
});

const MediaCreationSchema = refineSchema(MediaSchema);

module.exports = { MediaCreationSchema };
