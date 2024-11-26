const fs = require("fs");
const path = require("path");

exports.calculateProfit = (req, res) => {
  const { filterType, currency } = req.body;

  const ordersFilePath = path.join(__dirname, "../data/orders.json");
  const ordersFile = JSON.parse(fs.readFileSync(ordersFilePath, "utf-8"));
  const orders = ordersFile.orders;

  const calculateProfit = (order) => {
    const rate = currency === "USD" ? order.primary_rate : order.secondary_rate;
    const subtotal = order.subtotal * rate;

    const productProfits = JSON.parse(order.products).map((product) => {
      const totalCost = product.stocklogs.reduce((sum, log) => {
        const stockCost =
          log.stock_quantity *
          (log.stock_cost + log.shipment_cost + (log.credit_cost || 0));
        return sum + stockCost;
      }, 0);

      return {
        productName: product.product_name,
        quantity: product.quantity,
        totalCost,
        totalProfit: subtotal - totalCost,
      };
    });

    const totalProfit = productProfits.reduce(
      (sum, product) => sum + product.totalProfit,
      0
    );

    return {
      ...order,
      totalProfit,
      productProfits,
    };
  };

  const enrichedOrders = orders.map(calculateProfit);

  res.json(enrichedOrders);
};
