const Item = require('../models/item');
const Manufacturer = require('../models/manufacturer');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = (req, res) => {
    async.parallel({
        item_count: (callback) => {
            Item.countDocuments({}, callback);
        },
        manufacturer_count: (callback) => {
            Manufacturer.countDocuments({}, callback);
        },
        category_count: (callback) => {
            Category.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', { title: 'Inventory Home', error: err, data: results});
    })
};

// Display list of all items.
exports.item_list = (req, res, next) => {
    Item.find({}, 'name manufacturer')
    .populate('manufacturer')
    .exec( (err, list_items) => {
        if (err) { 
            return next(err); }
        res.render('item_list', { title: 'Item List', item_list: list_items });
    })
};

// Display detail page for a specific item.
exports.item_detail = (req, res, next) => {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec((err, result) => {
        if (err) { return next(err); }
        res.render('item_detail', { title: `${result.manufacturer.name} ${result.name}`, item: result });
    })  
};

// Display item create form on GET.
exports.item_create_get = (req, res, next) => {
    async.parallel({
        manufacturers: (callback) => {
            Manufacturer.find(callback);
        },
        categories: (callback) => {
            Category.find(callback);
        }
    }, (err, results) => {
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

        const item = new Item(
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
                manufacturers: (callback) => {
                    Manufacturer.find(callback);
                },
                categories: (callback) => {
                    Category.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err) }
                res.render('item_form', { title: 'Create Item', manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() });
            })
            return;
        }
        else {
            item.save( (err) => {
                if (err) { return next(err) }
                res.redirect(item.url);
            })
        }
    }

]

// Display item delete form on GET.
exports.item_delete_get = (req, res, next) => {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .exec((err, result) => {
        if (err) { return next(err) }
        res.render('item_delete', {title: 'Delete Item', item: result});
    })
};

// Handle item delete on POST.
exports.item_delete_post = (req, res, next) => {
    Item.findById(req.params.id)
    .populate('manufacturer')
    .populate('category')
    .exec((err) => {
        if (err) { return next(err) }
        else {
            Item.findByIdAndRemove(req.body.itemid,  function deleteItem(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/items')
            })
        }
    })
};

// Display item update form on GET.
exports.item_update_get = (req, res, next) => {
    async.parallel({
        item: (callback) => {
            Item.findById(req.params.id)
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        },
        manufacturers: (callback) => {
            Manufacturer.find(callback);
        },
        categories : (callback) => {
            Category.find(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.item == null) {
            const err = new Error('Item not found');
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

        const item = new Item(
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
                manufacturers: (callback) => {
                    Manufacturer.find(callback);
                },
                categories: (callback) => {
                    Category.find(callback);
                }
            }, (err, results) => {
                if (err) { return next(err) }
                res.render('item_form', { title: 'Update Item', manufacturers: results.manufacturers, categories: results.categories, item: item, errors: errors.array() });
            })
            return;
        }
        else {
            Item.findByIdAndUpdate(req.params.id, item, {}, (err, updatedItem) => {
                if (err) { return next(err) }
                res.redirect(updatedItem.url)
            })
        }
    }

]