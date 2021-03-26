const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function createModel(name, fields) {
    return mongoose.model(name, new Schema(fields));
}

const Customer = createModel("Customer", {
    email: String, // Email of customer is unique
    givenName: String,
    familyName: String
});

const Vendor = createModel("Vendor", {
    vendorId: String, // Name of vendor is unique
    open: Boolean,
    address: String,
    position: {
        longitude: Number,
        latitude: Number
    }
});

const OrderItem = createModel("OrderItem", {
    itemId: String,
    quantity: Number
});

const Order = createModel("Order", {
    orderId: Number,
    vendorId: String,
    createdAt: Date,
    modifiedAt: Date,
    ratingId: Number,
    items: [OrderItem.schema],
    status: {
        type: String,
        enum: ['Preparing', 'Cancelled', 'Ready for pickup', 'Done'],
        default: 'Preparing'
    },
    discounted: Boolean
});

const Rating = createModel("Rating", {
    ratingId: Number,
    ratingValue: Number,
    comment: String
});

const Item = createModel("Item", {
    itemId: Number,
    name: String,
    unitPrice: Number,
    photoURL: String,
});

const Globals = createModel("Globals", {
    orderChangeLimit: Number,
    discountLimit: Number
});

module.exports = {
    Customer,
    Vendor,
    OrderItem,
    Order,
    Rating,
    Item,
    Globals
}