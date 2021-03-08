const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    name: {type: String, required: true},
    manufacturer: {type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true, min: 0, max: 99999},
    stock: {type: Number, required: true, min: 0, max: 99999}
  }
);

// Virtual for book's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/inventory/item/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);