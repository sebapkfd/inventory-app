var Laptop = require('../models/laptop');
var Manufacturer = require('../models/manufacturer');
var Category = require('../models/category');

var async = require('async');

exports.index = function(req, res) {
    
    async.parallel({
        laptop_count: function(callback) {
            Laptop.countDocuments({}, callback);
        },
        manufacturer_count: function(callback) {
            Manufacturer.countDocuments({}, callback);
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Inventory Home', error: err, data: results});
    })
};

// Display list of all laptops.
exports.laptop_list = function(req, res, next) {
    Laptop.find({}, 'name manufacturer')
    .populate('manufacturer')
    .exec(function (err, list_laptops) {
        if (err) { 
            return next(err); }
        res.render('laptop_list', { title: 'Laptop List', laptop_list: list_laptops });
    })
};

// Display detail page for a specific laptop.
exports.laptop_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop detail: ' + req.params.id);
};

// Display laptop create form on GET.
exports.laptop_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop create GET');
};

// Handle laptop create on POST.
exports.laptop_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop create POST');
};

// Display laptop delete form on GET.
exports.laptop_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop delete GET');
};

// Handle laptop delete on POST.
exports.laptop_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop delete POST');
};

// Display laptop update form on GET.
exports.laptop_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop update GET');
};

// Handle laptop update on POST.
exports.laptop_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop update POST');
};