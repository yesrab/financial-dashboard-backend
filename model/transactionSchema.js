const mongoose = require("mongoose");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const transactionSchema = mongoose.Schema({
  productSKU: {
    type: String,
    required: [true, "please add product SKU"],
  },
  title: {
    type: String,
    required: [true, "please add an title for your product"],
  },
  price: {
    type: Number,
    required: [true, "please set a price for your product"],
    min: 0,
  },
  description: {
    type: String,
    required: [true, "please add a description for your product"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: {
      values: ["women's clothing", "electronics", "jewelery", "men's clothing"],
      message: "{value} is not a supported category",
    },
  },
  image: {
    type: String,
  },
  sold: {
    type: Boolean,
    required: [true, "please set a sales status"],
  },
  dateOfSale: {
    type: Date,
    required: [true, "please set a date of sale"],
  },
  monthOfSale: {
    type: String,
    // required: [true, "please add a month of sale"],
    enum: {
      values: monthNames,
      message: "{value} is not a supported month",
    },
  },
});

function getMonthName(dateString) {
  const dateObj = new Date(dateString);
  const month = dateObj.getMonth();
  const monthName = monthNames[month];
  return monthName;
}

transactionSchema.pre("save", function (next) {
  this.monthOfSale = getMonthName(this.dateOfSale);
  next();
});

const transaction = mongoose.model("transactions", transactionSchema);
module.exports = transaction;
