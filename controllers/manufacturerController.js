const Manufacturer = require('../models/manufacturer');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult} = require('express-validator');

// Display list of all manufacturers.
exports.manufacturer_list = (req, res, next) => {
    
    Manufacturer.find()
    .sort('ascending')
    .exec((err, list_manufacturers) => {
        if (err) { return next(err) }
        res.render('manufacturer_list', {title: 'Manufacturer List', manufacturer_list: list_manufacturers });
    });
};

// Display detail page for a specific manufacturer.
exports.manufacturer_detail = (req, res, next) => {

    async.parallel({
        manufacturer: (callback) => {
            Manufacturer.findById(req.params.id)
            .exec(callback)
        },
        manufacturer_items: (callback) => {
            Item.find({ 'manufacturer': req.params.id})
            .populate('manufacturer')
            .exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if(results.manufacturer == null) {
            const err = new Error('Manufacturer not found');
            err.status = 404;
            return next(err);
        }
        res.render('manufacturer_detail', { title: 'Manufacturer Detail', manufacturer: results.manufacturer, manufacturer_items: results.manufacturer_items });
    })
};

// Display manufacturer create form on GET.
exports.manufacturer_create_get = (req, res, next) => {
    res.render('manufacturer_form', { title: ' Create Manufacturer' });
};

// Handle manufacturer create on POST.
exports.manufacturer_create_post = [
    body('name', 'Manufacturer name required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('manufacturer_form', { title: ' Create Manufacturer', manufacturer: req.body, errors: errors.array( )});
            return;
        }
        else {
            const manufacturer = new Manufacturer(
                {
                    name: req.body.name,
                    description: req.body.description
                }
            );
            manufacturer.save((err) => {
                if (err) { return next(err) }
                res.redirect(manufacturer.url);
            })
        }
    }
];

// Display manufacturer delete form on GET.
exports.manufacturer_delete_get = (req, res, next) => {
    async.parallel({
        manufacturer: (callback) => {
            Manufacturer.findById(req.params.id).exec(callback);
        },
        manufacturers_items: (callback) => {
            Item.find({ 'manufacturer' : req.params.id})
            .populate('manufacturer')
            .exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.manufacturer == null) {
            res.redirect('/inventory/manufacturers');
        }
        res.render('manufacturer_delete', { title: 'Delete Manufacturer', manufacturer: results.manufacturer, manufacturer_items: results.manufacturers_items });
    });
};

// Handle manufacturer delete on POST.
exports.manufacturer_delete_post = (req, res, next) => {
    async.parallel({ 
        manufacturer: (callback) => {
            Manufacturer.findById(req.body.manufacturerid).exec(callback)
        },
        manufacturers_items: (callback) => {
            Item.find({ 'manufacturer' : req.body.manufacturerid})
            .populate('manufacturer')
            .exec(callback)
        }
    }, (err, results) => {  
        if (err) { return next(err) }
        if (results.manufacturers_items.length > 0) {
            res.render('manufacturer_delete', { title: 'Delete Manufacturer', manufacturer: results.manufacturer, manufacturer_items: results.manufacturers_items });
            return;
        }
        else {
            Manufacturer.findByIdAndRemove(req.body.manufacturerid,  function deleteManufacturer(err) {
                if (err) { return next(err) }
                res.redirect('/inventory/manufacturers')
            })
        }
    });
};

// Display manufacturer update form on GET.
exports.manufacturer_update_get = (req, res, next) => {
    Manufacturer.findById(req.params.id)
    .exec((err, result) => {
        if (err) { return next(err) }
        res.render('manufacturer_form', { title: 'Update Manufacturer', manufacturer: result });
    })
    
};

// Handle manufacturer update on POST.
exports.manufacturer_update_post = [
    body('name', 'Manufacturer name required').trim().isLength({ min: 1}).escape(),
    body('description', 'Description required').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('manufacturer_form', { title: ' Update Manufacturer', manufacturer: req.body, errors: errors.array( )});
            return;
        }
        else {
            const manufacturer = new Manufacturer(
                {
                    name: req.body.name,
                    description: req.body.description,
                    _id: req.params.id
                }
            );
            Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {}, (err, updatedManufacturer) => {
                if (err) { return next(err) }
                res.redirect(updatedManufacturer.url)
            })
        }
    }


]