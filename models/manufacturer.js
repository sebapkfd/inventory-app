var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ManufacturerSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 20},
    description: {type: String, maxlength: 500},
  }
);


ManufacturerSchema
.virtual('url')
.get(function () {
  return '/catalog/manufacturer/' + this._id;
});

module.exports = mongoose.model('Manufacturer', ManufacturerSchema);
