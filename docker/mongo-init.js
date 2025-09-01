// MongoDB Initialization Script
print('Starting MongoDB initialization...');

// Switch to the target database
db = db.getSiblingDB('HypesoftDB');

// Create collections
db.createCollection('products');
db.createCollection('categories');

// Create indexes for better performance
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "categoryId": 1 });
db.products.createIndex({ "stockQuantity.value": 1 });
db.products.createIndex({ "price.value": 1 });
db.products.createIndex({ "isDeleted": 1 });

db.categories.createIndex({ "name": 1 }, { unique: true });
db.categories.createIndex({ "isActive": 1 });
db.categories.createIndex({ "isDeleted": 1 });

// Insert sample categories
var electronicsCategory = {
    "_id": ObjectId(),
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "isActive": true,
    "isDeleted": false,
    "createdAt": new Date(),
    "updatedAt": new Date()
};

var clothingCategory = {
    "_id": ObjectId(),
    "name": "Clothing",
    "description": "Apparel and fashion items",
    "isActive": true,
    "isDeleted": false,
    "createdAt": new Date(),
    "updatedAt": new Date()
};

var booksCategory = {
    "_id": ObjectId(),
    "name": "Books",
    "description": "Books and educational materials",
    "isActive": true,
    "isDeleted": false,
    "createdAt": new Date(),
    "updatedAt": new Date()
};

db.categories.insertMany([electronicsCategory, clothingCategory, booksCategory]);

// Insert sample products
var sampleProducts = [
    {
        "_id": ObjectId(),
        "name": "iPhone 15 Pro",
        "description": "Latest Apple smartphone with advanced features",
        "price": { "value": 999.99 },
        "categoryId": electronicsCategory._id.str,
        "stockQuantity": { "value": 5 },
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "MacBook Air M3",
        "description": "Powerful laptop for professionals",
        "price": { "value": 1299.99 },
        "categoryId": electronicsCategory._id.str,
        "stockQuantity": { "value": 3 },
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "Nike Air Max",
        "description": "Comfortable running shoes",
        "price": { "value": 129.99 },
        "categoryId": clothingCategory._id.str,
        "stockQuantity": { "value": 25 },
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "Clean Code",
        "description": "A handbook of agile software craftsmanship",
        "price": { "value": 39.99 },
        "categoryId": booksCategory._id.str,
        "stockQuantity": { "value": 8 },
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "_id": ObjectId(),
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": { "value": 199.99 },
        "categoryId": electronicsCategory._id.str,
        "stockQuantity": { "value": 12 },
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
    }
];

db.products.insertMany(sampleProducts);

print('MongoDB initialization completed successfully!');
print('Sample data inserted: ' + db.categories.count() + ' categories and ' + db.products.count() + ' products');
