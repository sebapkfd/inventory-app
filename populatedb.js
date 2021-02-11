#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

var Laptop = require('./models/laptop')
var Category = require('./models/category')
var Manufacturer = require('./models/manufacturer')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var laptops = []
var categories = []
var manufacturers = []


function categoryCreate(name, description, cb){
    categorydetail = {name: name, description: description}
    var category = new Category(categorydetail);

    category.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category)
    });
}

function manufacturerCreate(name, description, cb) {
    manufacturerdetail = { name: name, description: description}
    var manufacturer = new Manufacturer(manufacturerdetail);
    manufacturer.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Manufacturer: ' + manufacturer);
        manufacturers.push(manufacturer);
        cb(null, manufacturer)
    });
}

function laptopCreate(name, manufacturer, category, desc, price, stock, cb) {
    laptopdetail = {
        name: name,
        manufacturers: manufacturer,
        categories: category,
        desc: desc,
        price: price,
        stock: stock
    }
    var laptop = new Laptop(laptopdetail);
    laptop.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Laptop' + laptop);
        laptops.push(laptop)
        cb(null, laptop)
    })
}


function createCategory(cb) {
    async.series([
        function(callback) {
            categoryCreate('Laptops', 'All in one Laptops', callback);
        }
    ],
    cb);
}


function createManufacturers(cb) {
    async.parallel([
        function(callback) {
            manufacturerCreate('Asus', 'TBA', callback);
        },
        function(callback) {
            manufacturerCreate('Acer', 'TBA', callback);
        }
    ],
    cb)
}


function createLaptops(cb) {
    async.parallel([
        function(callback) {
            laptopCreate('Aspire', 'Acer', 'Laptops', 'TBA', 668, 50, callback);
        },
        function(callback) {
            laptopCreate('TUF', 'Asus', 'Laptops', 'TBA', 867, 15, callback);
        },
        function(callback) {
            laptopCreate('ROG', 'Asus', 'Laptops', 'TBA', 1499, 10, callback);
        },
        function(callback) {
            laptopCreate('Predator', 'Acer', 'Laptops', 'TBA', 1629, 10, callback);
        },
        function(callback) {
            laptopCreate('Nitro', 'Acer', 'Laptops', 'TBA', 999, 16, callback);
        },
        function(callback) {
            laptopCreate('Vivobook', 'Asus', 'Laptops', 'TBA', 639, 11, callback);
        },
        function(callback) {
            laptopCreate('Zenbook', 'Asus', 'Laptops', 'TBA', 1990, 13, callback);
        }
    ],
    cb);
}


async.series(
    [createCategory, createManufacturers, createLaptops],
function(err, result) {
    if (err) {
        console.log('Final error:' + err);
    }
    else {
        console.log('Laptop instances: ' + laptops);
    }
    mongoose.connection.close();
}
);