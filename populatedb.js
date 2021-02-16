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

var Item = require('./models/item')
var Category = require('./models/category')
var Manufacturer = require('./models/manufacturer')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var items = []
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

function itemCreate(name, manufacturer, category, desc, price, stock, cb) {
    
    itemdetail = {
        name: name,
        manufacturer: manufacturer,
        category: category,
        desc: desc,
        price: price,
        stock: stock
    }
      
    var item = new Item(itemdetail);    
    item.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New item: ' + item);
      items.push(item)
      cb(null, item)
    }  );
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
    async.series([
        function(callback) {
            manufacturerCreate('Asus', 'TBA', callback);
        },
        function(callback) {
            manufacturerCreate('Acer', 'TBA', callback);
        }
    ],
    cb)
}


function createItems(cb) {
    async.parallel([
        function(callback) {
            itemCreate('Aspire', manufacturers[1], categories[0], 'TBA', 668, 50, callback);
        },
        function(callback) {
            itemCreate('TUF', manufacturers[0], categories[0], 'TBA', 867, 15, callback);
        },
        function(callback) {
            itemCreate('ROG', manufacturers[0], categories[0], 'TBA', 1499, 10, callback);
        },
        function(callback) {
            itemCreate('Predator', manufacturers[1], categories[0], 'TBA', 1629, 10, callback);
        },
        function(callback) {
            itemCreate('Nitro', manufacturers[1], categories[0], 'TBA', 999, 16, callback);
        },
        function(callback) {
            itemCreate('VivoLaptop', manufacturers[0], categories[0], 'TBA', 639, 11, callback);
        },
        function(callback) {
            itemCreate('ZenLaptop', manufacturers[0], categories[0], 'TBA', 1990, 13, callback);
        }
    ],
    cb);
}

async.series(
    [createCategory, createManufacturers, createItems],
function(err, result) {
    if (err) {
        console.log('Final error:' + err);
    }
    else {
        console.log('Item instances: ' + items);
    }
    mongoose.connection.close();
}
);