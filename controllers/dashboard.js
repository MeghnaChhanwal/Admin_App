const Order = require("../models/Order");

exports.getDashboardData = async (req, res) => {
  try {
    // 1. Total Revenue (सर्व ऑर्डरमधील totalAmount ची बेरीज)
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 2. Total Clients (Unique मोबाइल नंबर गिणे)
    const totalClientsAgg = await Order.aggregate([
      { $group: { _id: "$user.mobile" } },
      { $count: "uniqueClients" },
    ]);
    const totalClients = totalClientsAgg[0]?.uniqueClients || 0;

    // 3. Total Orders (Order collection मधील एकूण documents)
    const totalOrders = await Order.countDocuments();

    // 4. Order Summary (Order Type नुसार counts)
    const orderSummaryAgg = await Order.aggregate([
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
        },
      },
    ]);
    const orderSummary = { dinein: 0, takeaway: 0, served: 0 };
    orderSummaryAgg.forEach((item) => {
      orderSummary[item._id] = item.count;
    });

    // Response म्हणून पाठवणे
    res.json({
      totalRevenue,
      totalClients,
      totalOrders,
      orderSummary,
    });
  } catch (err) {
    console.error("Dashboard data error:", err);
    res.status(500).json({ message: "Failed to get dashboard data" });
  }
};
