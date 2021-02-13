var Laptop = require('../models/laptop');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all laptops.
exports.laptop_list = function(req, res) {
    res.send('NOT IMPLEMENTED: laptop list');
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