const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB || "uri";
console.log(DB_URI);

const transaction = require("./model/transactionSchema");

mongoose.connect(DB_URI);

async function populateDatabase() {
  try {
    // Clear existing data
    await transaction.deleteMany({});

    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await response.json();
    const templateData = data.map((product) => {
      return {
        productSKU: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        sold: product.sold,
        dateOfSale: product.dateOfSale,
        monthOfSale: product.monthOfSale,
      };
    });
    // console.log(templateData);
    // const insertedData = await transaction.insertMany(templateData);
    // console.log(insertedData);

    const insertedData = [];
    for (const data of templateData) {
      try {
        const savedTransaction = await transaction.create(data);
        insertedData.push(savedTransaction);
      } catch (error) {
        console.error("Error saving transaction:", error);
      }
    }
    console.log(insertedData);
  } catch (error) {
    console.error("Error populating data:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

populateDatabase();
