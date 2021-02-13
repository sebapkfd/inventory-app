var express = require('express');
var router = express.Router();

// Require controller modules.
// var laptop_controller = require('../controllers/laptopController');
var manufacturer_controller = require('../controllers/manufacturerController');
var category_controller = require('../controllers/categoryController');

var laptop_controller = require('../controllers/laptopController');
var category_controller = require('../controllers/categoryController');
var manufacturer_controller = require('../controllers/manufacturerController');

/// laptop ROUTES ///

// GET catalog home page.
router.get('/', laptop_controller.index);

// GET request for creating a laptop. NOTE This must come before routes that display laptop (uses id).
router.get('/laptop/create', laptop_controller.laptop_create_get);

// POST request for creating laptop.
router.post('/laptop/create', laptop_controller.laptop_create_post);

// GET request to delete laptop.
router.get('/laptop/:id/delete', laptop_controller.laptop_delete_get);

// POST request to delete laptop.
router.post('/laptop/:id/delete', laptop_controller.laptop_delete_post);

// GET request to update laptop.
router.get('/laptop/:id/update', laptop_controller.laptop_update_get);

// POST request to update laptop.
router.post('/laptop/:id/update', laptop_controller.laptop_update_post);

// GET request for one laptop.
router.get('/laptop/:id', laptop_controller.laptop_detail);

// GET request for list of all laptop items.
router.get('/laptops', laptop_controller.laptop_list);

/// manufacturer ROUTES ///

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get('/manufacturer/create', manufacturer_controller.manufacturer_create_get);

// POST request for creating manufacturer.
router.post('/manufacturer/create', manufacturer_controller.manufacturer_create_post);

// GET request to delete manufacturer.
router.get('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_get);

// POST request to delete manufacturer.
router.post('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_post);

// GET request to update manufacturer.
router.get('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_get);

// POST request to update manufacturer.
router.post('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_post);

// GET request for one manufacturer.
router.get('/manufacturer/:id', manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get('/manufacturers', manufacturer_controller.manufacturer_list);

/// category ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category.
router.get('/categorys', category_controller.category_list);


module.exports = router;