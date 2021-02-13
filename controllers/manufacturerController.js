var Manufacturer = require('../models/manufacturer');

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
exports.manufacturer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer detail: ' + req.params.id);
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