var Manufacturer = require('../models/manufacturer');
var Laptop = require('../models/laptop');
var async = require('async');

// Display list of all manufacturers.
exports.manufacturer_list = function(req, res, next) {
    
    Manufacturer.find()
    .sort('ascending')
    .exec(function(err, list_manufacturers) {
        if (err) { return next(err) }
        res.render('manufacturer_list', {title: 'Manufacturer List', manufacturer_list: list_manufacturers });
    });
};

// Display detail page for a specific manufacturer.
exports.manufacturer_detail = function(req, res, next) {

    async.parallel({
        manufacturer: function(callback) {
            Manufacturer.findById(req.params.id)
            .exec(callback)
        },
        manufacturer_laptops: function(callback) {
            Laptop.find({ 'manufacturer': req.params.id})
            .populate('manufacturer')
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        if(results.manufacturer == null) {
            var err = new Error('Manufacturer not found');
            err.status = 404;
            return next(err);
        }
        res.render('manufacturer_detail', { title: 'Manufacturer Detail', manufacturer: results.manufacturer, manufacturer_laptops: results.manufacturer_laptops });
    })
};

// Display manufacturer create form on GET.
exports.manufacturer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer create GET');
};

// Handle manufacturer create on POST.
exports.manufacturer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer create POST');
};

// Display manufacturer delete form on GET.
exports.manufacturer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer delete GET');
};

// Handle manufacturer delete on POST.
exports.manufacturer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer delete POST');
};

// Display manufacturer update form on GET.
exports.manufacturer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer update GET');
};

// Handle manufacturer update on POST.
exports.manufacturer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer update POST');
};