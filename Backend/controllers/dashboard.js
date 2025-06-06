const Order = require('../models/Order');
const Chef = require('../models/Chef');
const Table = require('../models/Table');

exports.getDashboardData = async (req, res) => {
  try {
    const chefs = await Chef.find();
    const orders = await Order.find();
    const tables = await Table.find();

    const totalRevenue = orders.reduce((sum, order) => {
      const itemTotal = order.cartItems?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
      return sum + itemTotal;
    }, 0);

    const dinein = orders.filter(o => o.orderType === 'dinein').length;
    const takeaway = orders.filter(o => o.orderType === 'takeaway').length;

    const clients = [...new Set(orders.map(o => o.user.mobile))];

    const chefStats = chefs.map(chef => ({
      name: chef.name,
      orders: orders.filter(o => o.chef === chef.name).length,
    }));

    const reserved = tables.filter(t => t.isReserved).length;
    const available = tables.length - reserved;

    res.json({
      totalChef: chefs.length,
      totalRevenue,
      totalOrders: orders.length,
      totalClients: clients.length,
      orderSummary: { dinein, takeaway },
      tableStats: { reserved, available },
      chefStats,
      tables: tables.map(t => t.name),
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
};
