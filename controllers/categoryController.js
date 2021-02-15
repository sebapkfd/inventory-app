var Category = require('../models/category');
var Laptop = require('../models/laptop');
var async = require('async');
const { body, validationResult } = require("express-validator");

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
exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create Category'});
};

// Handle category create on POST.
exports.category_create_post = [
    body('name', 'Category name required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({ min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description
            }
        );

        if(!errors.isEmpty()) {
            res.render('category_form', { title: ' Create Category', category: category, errors: errors.array()});
            return;
        }
        else {
            Category.findOne({ 'name': req.body.name})
            .exec(function(err, found_category) {
                if (err) { return next(err) }
                if (found_category) {
                    res.redirect(found_category.url);
                }
                else {
                    category.save(function(err) {
                        if (err) { return next(err) }
                        res.redirect(category.url);
                    })
                }
            });
        }
    }
]

// Display category delete form on GET.
exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_laptops: function(callback) {
            Laptop.find({ 'category': req.params.id})
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.category == null) {
            res.redirect('/inventory/categories');
        }
        res.render('category_delete', { title: 'Category Delete', category: results.category, category_laptops: results.category_laptops });
    })
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_laptops: function(callback) {
            Laptop.find({ 'category': req.params.id})
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.category_laptops.length > 0) {
            res.render('category_delete', { title: 'Category Delete', category: results.category, category_laptops: results.category_laptops });
        }
        else { 
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/categories')
            })
        }
    })
};

// Display category update form on GET.
exports.category_update_get = function(req, res, next) {
    Category.findById(req.params.id)
    .exec(function(err, result) {
        if (err) { return next(err) }
        res.render('category_form', { title: 'Update Category', category: result });
    }) 
};

// Handle category update on POST.
exports.category_update_post = [
    body('name', 'Category name required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('category_form', { title: ' Create Category', category: category, errors: errors.array()});
            return;
        }
        else {
            var category = new Category(
                {
                    name: req.body.name,
                    description: req.body.description,
                    _id: req.params.id
                }
            );
            Category.findByIdAndUpdate(req.params.id, category, {}, function(err, thecategory) {
                if (err) { next(err) }
                res.redirect(thecategory.url)
            })
        }
    }
]