const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

autoIncrement.initialize(mongoose.connection);

const locationSchema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      locationType: {
        type: String,
        default: 'etc.',
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      isToiletExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isChargerExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isElevatorExists: {
        type: Boolean,
        required: true,
        default: false,
      },
      isSlopeExists: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    },
);

locationSchema.statics = {
  async get(id) {
    const loc = await this.findById(id).exec();
    if (loc) {
      return loc;
    }
    throw new APIError({
      message: 'Location does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  list({page, perPage}) {
    return this.find()
        .sort({_id: 1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
  },
  searchList(query, {page, perPage}) {
    return this.find(query)
        .sort({_id: 1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
  },
  getSize() {
    return this.count();
  },
};

locationSchema.plugin(autoIncrement.plugin, {
  model: 'Location',
  field: '_id',
  startAt: 1,
  increment: 1,
});

module.exports = mongoose.model('Location', locationSchema);
