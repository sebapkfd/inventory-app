var Laptop = require('../models/laptop');
var Manufacturer = require('../models/manufacturer');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

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
exports.laptop_detail = function(req, res, next) {
    Laptop.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec(function(err, result) {
        if (err) { return next(err); }
        res.render('laptop_detail', { title: `${result.manufacturer.name} ${result.name}`, laptop: result });
    })  
};

// Display laptop create form on GET.
exports.laptop_create_get = function(req, res, next) { 
    async.parallel({
        manufacturers: function(callback) {
            Manufacturer.find(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        res.render('laptop_form', { title: ' Create Laptop', manufacturers: results.manufacturers, categories: results.categories });
    });
};

// Handle laptop create on POST.
exports.laptop_create_post = [
    body('name', 'Name must not be empty').trim().isLength({ min:1 }).escape(),
    body('manufacturer', 'Manufacturer must not be empty').trim().isLength({ min:1 }).escape(),
    body('category', 'Category must not be empty').trim().isLength({ min:1 }).escape(),
    body('desc', 'Decription must not be empty').trim().isLength({ min:1 }).escape(),
    body('price', 'Price has to be between $0 and $99999').trim().isFloat({ min : 0, max: 99999 }).escape(),
    body('stock', 'Stock has to be between 0 and 99999').trim().isInt({ min : 0, max: 99999 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var laptop = new Laptop(
            {
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                desc: req.body.desc,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock
            }
        );
        if (!errors.isEmpty()) {
            async.parallel({
                manufacturers: function(callback) {
                    Manufacturer.find(callback);
                },
                categories: function(callback) {
                    Category.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err) }
                res.render('laptop_form', { title: 'Create Laptop', manufacturers: results.manufacturers, categories: results.categories, laptop: laptop, errors: errors.array() });
            })
            return;
        }
        else {
            laptop.save(function (err) {
                if (err) { return next(err) }
                res.redirect(laptop.url);
            })
        }
    }

]

// Display laptop delete form on GET.
exports.laptop_delete_get = function(req, res, next) {
    Laptop.findById(req.params.id)
    .populate('manufacturer')
    .exec(function(err, result) {
        if (err) { return next(err) }
        res.render('laptop_delete', {title: 'Delete Laptop', laptop: result});
    })
};

// Handle laptop delete on POST.
exports.laptop_delete_post = function(req, res, next) {
    Laptop.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec(function(err, result) {
        if (err) { return next(err) }
        else {
            Laptop.findByIdAndRemove(req.body.laptopid, function deleteLaptop(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/laptops')
            })
        }
    })
};

// Display laptop update form on GET.
exports.laptop_update_get = function(req, res, next) {
    async.parallel({
        laptop: function(callback) {
            Laptop.findById(req.params.id)
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        },
        manufacturers: function(callback) {
            Manufacturer.find(callback);
        },
        categories : function(callback) {
            Category.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        if (results.laptop == null) {
            var err = new Error('Laptop not found');
            err.status = 404;
            return next(err);
        }
        res.render('laptop_form', { title: 'Update Laptop', manufacturers: results.manufacturers, categories: results.categories, laptop: results.laptop });
    });
};

// Handle laptop update on POST.
exports.laptop_update_post = [
    body('name', 'Name must not be empty').trim().isLength({ min:1 }).escape(),
    body('manufacturer', 'Manufacturer must not be empty').trim().isLength({ min:1 }).escape(),
    body('category', 'Category must not be empty').trim().isLength({ min:1 }).escape(),
    body('desc', 'Decription must not be empty').trim().isLength({ min:1 }).escape(),
    body('price', 'Price has to be between $0 and $99999').trim().isFloat({ min : 0, max: 99999 }).escape(),
    body('stock', 'Stock has to be between 0 and 99999').trim().isInt({ min : 0, max: 99999 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var laptop = new Laptop(
            {
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                desc: req.body.desc,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock,
                _id:req.params.id
            }
        );
        if (!errors.isEmpty()) {
            async.parallel({
                manufacturers: function(callback) {
                    Manufacturer.find(callback);
                },
                categories: function(callback) {
                    Category.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err) }
                res.render('laptop_form', { title: 'Create Laptop', manufacturers: results.manufacturers, categories: results.categories, laptop: laptop, errors: errors.array() });
            })
            return;
        }
        else {
            Laptop.findByIdAndUpdate(req.params.id, laptop, {}, function(err, thelaptop) {
                if (err) { return next(err) }
                res.redirect(thelaptop.url)
            })
        }
    }

]