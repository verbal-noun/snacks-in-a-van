const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function createModel(name, fields) {
    return mongoose.model(name, new Schema(fields));
}

const Customer = createModel("Customer", {
    email: String,
    name: {
        given: String,
        family: String    
    }
});

const Vendor = createModel("Vendor", {
    name: String,
    open: Boolean,
    address: String,
    position: {
        longitude: Number,
        latitude: Number
    }
});

const OrderItem = createModel("OrderItem", {
    item: Schema.Types.ObjectId,
    quantity: Number
});

const Order = createModel("Order", {
    vendor: Schema.Types.ObjectId,
    createdAt: Date,
    modifiedAt: Date,
    rating: Schema.Types.ObjectId,
    items: [OrderItem.schema],
    status: {
        type: String,
        enum: ['Preparing', 'Cancelled', 'Ready for pickup', 'Done'],
        default: 'Preparing'
    },
    discounted: Boolean
});

const Rating = createModel("Rating", {
    value: Number,
    comment: String
});

const Item = createModel("Item", {
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