const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function createModel(name, fields) {
  return mongoose.model(name, new Schema(fields));
}

const Customer = createModel("Customer", {
  email: String,
  name: {
    given: String,
    family: String,
  },
  password: String,
  token: String,
});

const Vendor = createModel("Vendor", {
  name: String,
  open: Boolean,
  address: String,
  position: {
    longitude: Number,
    latitude: Number,
  },
  password: String,
  token: String,
});

const OrderItem = createModel("OrderItem", {
  item: Schema.Types.ObjectId,
  quantity: Number,
});

const Order = createModel("Order", {
  vendor: Schema.Types.ObjectId,
  author: Schema.Types.ObjectId,
  createdAt: Date,
  modifiedAt: Date,
  rating: Schema.Types.ObjectId,
  items: [OrderItem.schema],
  status: {
    type: String,
    enum: ["Preparing", "Cancelled", "Ready for pickup", "Done"],
    default: "Preparing",
  },
  discounted: Boolean,
});

const Rating = createModel("Rating", {
  value: Number,
  comment: String,
});

const Item = createModel("Item", {
  name: String,
  unitPrice: Number,
  photoURL: String,
});

const Globals = createModel("Globals", {
  name: String,
  value: Number,
});

module.exports = {
  Customer,
  Vendor,
  OrderItem,
  Order,
  Rating,
  Item,
  Globals,
};
