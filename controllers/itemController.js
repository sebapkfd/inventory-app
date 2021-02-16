var Item = require('../models/item');
var Manufacturer = require('../models/manufacturer');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function(req, res) {
    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({}, callback);
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

// Display list of all items.
exports.item_list = function(req, res, next) {
    Item.find({}, 'name manufacturer')
    .populate('manufacturer')
    .exec(function (err, list_items) {
        if (err) { 
            return next(err); }
        res.render('item_list', { title: 'Item List', item_list: list_items });
    })
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec(function(err, result) {
        if (err) { return next(err); }
        res.render('item_detail', { title: `${result.manufacturer.name} ${result.name}`, item: result });
    })  
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) { 
    async.parallel({
        manufacturers: function(callback) {
            Manufacturer.find(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) }
        res.render('item_form', { title: ' Create Item', manufacturers: results.manufacturers, categories: results.categories });
    });
};

// Handle item create on POST.
exports.item_create_post = [
    body('name', 'Name must not be empty').trim().isLength({ min:1 }).escape(),
    body('manufacturer', 'Manufacturer must not be empty').trim().isLength({ min:1 }).escape(),
    body('category', 'Category must not be empty').trim().isLength({ min:1 }).escape(),
    body('desc', 'Decription must not be empty').trim().isLength({ min:1 }).escape(),
    body('price', 'Price has to be between $0 and $99999').trim().isFloat({ min : 0, max: 99999 }).escape(),
    body('stock', 'Stock has to be between 0 and 99999').trim().isInt({ min : 0, max: 99999 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
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
                res.render('item_form', { title: 'Create Item', manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() });
            })
            return;
        }
        else {
            item.save(function (err) {
                if (err) { return next(err) }
                res.redirect(item.url);
            })
        }
    }

]

// Display item delete form on GET.
exports.item_delete_get = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .exec(function(err, result) {
        if (err) { return next(err) }
        res.render('item_delete', {title: 'Delete Item', item: result});
    })
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec(function(err) {
        if (err) { return next(err) }
        else {
            Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/items')
            })
        }
    })
};

// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
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
        if (results.item == null) {
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_form', { title: 'Update Item', manufacturers: results.manufacturers, categories: results.categories, item: results.item });
    });
};

// Handle item update on POST.
exports.item_update_post = [
    body('name', 'Name must not be empty').trim().isLength({ min:1 }).escape(),
    body('manufacturer', 'Manufacturer must not be empty').trim().isLength({ min:1 }).escape(),
    body('category', 'Category must not be empty').trim().isLength({ min:1 }).escape(),
    body('desc', 'Decription must not be empty').trim().isLength({ min:1 }).escape(),
    body('price', 'Price has to be between $0 and $99999').trim().isFloat({ min : 0, max: 99999 }).escape(),
    body('stock', 'Stock has to be between 0 and 99999').trim().isInt({ min : 0, max: 99999 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
            {
                name: req.body.name,
                manufacturer: req.body.manufacturer,
                desc: req.body.desc,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock,
                _id: req.params.id
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
                res.render('item_form', { title: 'Update Item', manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() });
            })
            return;
        }
        else {
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err, updatedItem) {
                if (err) { return next(err) }
                res.redirect(updatedItem.url)
            })
        }
    }

]