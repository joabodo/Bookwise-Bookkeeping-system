const mongoose = require("mongoose");
const MEDIA_TYPES = require("../config/constants/MEDIA_TYPES");
const MEDIA_PROVIDERS = require("../config/constants/MEDIA_PROVIDERS");

const Schema = mongoose.Schema;

const mediaTypeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    enum: {
      values: MEDIA_TYPES,
      message: "{VALUE} is not a valid media type",
    },
  },
});

const mediaProviderSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    enum: {
      values: MEDIA_PROVIDERS,
      message: "{VALUE} is not a valid media provider",
    },
  },
});

const mediaSchema = new Schema({
  key: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: mediaTypeSchema,
    required: true,
  },
  provider: {
    type: mediaProviderSchema,
    required: true,
  },
  //   Meta field can contain more detailed information based on the media type and provider. E.g Image Dimensions, mux asset_ID, etc
  meta: {
    muxAssetId: {
      type: String,
      required: function () {
        return this.provider === "mux";
      },
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    format: String,
    size: mongoose.Schema.Types.Decimal128,
  },
});

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
