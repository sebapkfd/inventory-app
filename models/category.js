var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true, maxlength:20},
        description: {type: String, maxlength: 500}
    }
)

CategorySchema
.virtual('url')
.get(function () {
    return '/inventory/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);