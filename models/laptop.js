var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LaptopSchema = new Schema(
  {
    name: {type: String, required: true},
    manufacturer: {type: Schema.Types.ObjectId, ref: 'Manufacturer', required: false},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: false},
    desc: {type: String, required: true},
    price: {type: Number, required: true, min: 0, max: 99999},
    stock: {type: Number, required: true, min: 0, max: 99999}
  }
);

// Virtual for book's URL
LaptopSchema
.virtual('url')
.get(function () {
  return '/catalog/laptop/' + this._id;
});

//Export model
module.exports = mongoose.model('Laptop', LaptopSchema);