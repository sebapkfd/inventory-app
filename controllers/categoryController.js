const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require("express-validator");

// Display list of all categories.
exports.category_list = (req, res, next) => {

    Category.find()
    .sort('ascending')
    .exec((err, list_categories) => {
        if (err) { return next(err) }
        res.render('category_list', { title: 'Category List', category_list: list_categories });
    })
    
};

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
    
    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id)
            .exec(callback)
        },
        category_items: (callback) => {
            Item.find({ 'category': req.params.id })
            .populate('manufacturer')
            .exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.category == null) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_detail', { title: 'Category Detail', category: results.category, category_items: results.category_items });
    })
};

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
    res.render('category_form', { title: 'Create Category'});
};

// Handle category create on POST.
exports.category_create_post = [
    body('name', 'Category name required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({ min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        const category = new Category(
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
            .exec((err, found_category) => {
                if (err) { return next(err) }
                if (found_category) {
                    res.redirect(found_category.url);
                }
                else {
                    category.save((err) => {
                        if (err) { return next(err) }
                        res.redirect(category.url);
                    })
                }
            });
        }
    }
]

// Display category delete form on GET.
exports.category_delete_get = (req, res, next) => {
    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_items: (callback) => {
            Item.find({ 'category': req.params.id})
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.category == null) {
            res.redirect('/inventory/categories');
        }
        res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items });
    })
};

// Handle category delete on POST.
exports.category_delete_post = (req, res, next) => {
    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_items: (callback) => {
            Item.find({ 'category': req.params.id})
            .populate('manufacturer')
            .populate('category')
            .exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.category_items.length > 0) {
            res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items });
        }
        else { 
            Category.findByIdAndRemove(req.body.categoryid,  function deleteCategory(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/categories')
            })
        }
    })
};

// Display category update form on GET.
exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id)
    .exec((err, result) => {
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
            res.render('category_form', { title: 'Update Category', category: category, errors: errors.array()});
            return;
        }
        else {
            const category = new Category(
                {
                    name: req.body.name,
                    description: req.body.description,
                    _id: req.params.id
                }
            );
            Category.findByIdAndUpdate(req.params.id, category, {}, (err, updatedCategory) => {
                if (err) { next(err) }
                res.redirect(updatedCategory.url)
            })
        }
    }
]