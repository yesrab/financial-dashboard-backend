const { request, response } = require("express");
const transactionModel = require("../model/transactionSchema");

const test = (req, res) => {
  res.json({
    message: "transaction route working",
  });
};

async function getAllTransactionsFunction(request, response) {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const month = request.query.month;
  const search = request.query.search;
  const dbQuery = {};

  if (month) {
    dbQuery.monthOfSale = month;
  }
  if (search && !!search.trim() && isNaN(Number(search))) {
    dbQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  } else if (search && !!search.trim() && !isNaN(Number(search))) {
    dbQuery.price = Number(search);
  }

  const allTransactions = await transactionModel.find(dbQuery);
  const totalAvailableItems = allTransactions.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const transactions = allTransactions.slice(startIndex, endIndex);

  const pageDetails = {};

  if (endIndex < totalAvailableItems) {
    pageDetails.next = {
      limit: limit,
      page: page + 1,
    };
  }

  if (startIndex > 0) {
    pageDetails.previous = {
      limit: limit,
      page: page - 1,
    };
  }

  return {
    page,
    limit,
    ...pageDetails,
    totalAvailableItems,
    transactions,
  };
}

async function transactionStatisticsFunction(request, response) {
  const month = request.query.month;
  const allTransactions = await transactionModel.find({
    monthOfSale: month,
  });

  const totalAvailableItems = allTransactions.length;

  const totalSalesAmmount = allTransactions.reduce(
    (accumulator, transaction) => {
      return accumulator + transaction.price;
    },
    0
  );

  const TotalNumberOfSold = allTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.sold) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    },
    0
  );
  const TotalNumber0fNotSold = allTransactions.reduce(
    (accumulator, transaction) => {
      if (!transaction.sold) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    },
    0
  );
  return {
    month,
    totalAvailableItems,
    totalSalesAmmount,
    TotalNumberOfSold,
    TotalNumber0fNotSold,
  };
}

async function getProductsPriceRangeFunction(request, response) {
  const month = request.query.month;
  const priceRangeTemplate = [
    { min: 0, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 300 },
    { min: 300, max: 400 },
    { min: 400, max: 500 },
    { min: 500, max: 600 },
    { min: 600, max: 700 },
    { min: 700, max: 800 },
    { min: 800, max: 900 },
    { min: 900, max: Infinity },
  ];

  const itemsPerPriceRange = await Promise.all(
    priceRangeTemplate.map(async (range) => {
      const items = await transactionModel.countDocuments({
        price: { $gte: range.min, $lt: range.max },
        monthOfSale: month,
      });
      return {
        priceRange: `${range.min}-${
          range.max === Infinity ? "above" : range.max
        }`,
        items,
      };
    })
  );

  return {
    itemsPerPriceRange,
  };
}

async function itemsPerCatagoryFunction(request, response) {
  const month = request.query.month;
  const dbQuery = {};

  if (month) {
    dbQuery.monthOfSale = month;
  }
  const catagories = await transactionModel.distinct("category");

  const data = await Promise.all(
    catagories.map(async (item) => {
      const count = await (itemData = transactionModel.countDocuments({
        ...dbQuery,
        category: item,
      }));
      return { [item]: count };
    })
  );
  let catagroryCount = {};
  data.map((item) => {
    catagroryCount = {
      ...catagroryCount,
      ...item,
    };
  });
  return { catagroryCount };
}

const getAllTransactions = async (request, response) => {
  const data = await getAllTransactionsFunction(request, response);
  response.json(data);
};

const transactionStatistics = async (request, response) => {
  const data = await transactionStatisticsFunction(request, response);
  response.json(data);
};

const getProductsPriceRange = async (request, response) => {
  const data = await getProductsPriceRangeFunction(request, response);
  response.json(data);
};

const itemsPerCatagory = async (request, response) => {
  const data = await itemsPerCatagoryFunction(request, response);
  response.json(data);
};

const getStaticsData = async (request, response) => {
  const transactionStatistics = await transactionStatisticsFunction(
    request,
    response
  );
  const ProductsPriceRange = await getProductsPriceRangeFunction(
    request,
    response
  );
  const itemsPerCatagory = await itemsPerCatagoryFunction(request, response);

  response.json({
    transactionStatistics,
    ...ProductsPriceRange,
    itemsPerCatagory,
  });
};

module.exports = {
  test,
  getAllTransactions,
  transactionStatistics,
  getProductsPriceRange,
  itemsPerCatagory,
  getStaticsData,
};
