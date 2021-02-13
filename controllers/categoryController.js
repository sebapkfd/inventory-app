var Category = require('../models/category');
var Laptop = require('../models/laptop');
var async = require('async');

// Display list of all categories.
exports.category_list = function(req, res, next) {

    Category.find()
    .sort('ascending')
    .exec(function(err, list_categories) {
        if (err) { return next(err) }
        res.render('category_list', { title: 'Category List', category_list: list_categories });
    })
    
};

// Display detail page for a specific category.
exports.category_detail = function(req, res, next) {
    
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
            .exec(callback)
        },
        category_laptops: function(callback) {
            Laptop.find({ 'category': req.params.id })
            .populate('manufacturer')
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category == null) {
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_detail', { title: 'Category Detail', category: results.category, category_laptops: results.category_laptops });
    })
};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category create GET');
};

// Handle category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category update POST');
};