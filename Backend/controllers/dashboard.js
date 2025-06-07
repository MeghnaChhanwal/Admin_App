const Order = require("../models/Order");
const Chef  = require("../models/Chef");
const Table = require("../models/Table");

// — Dashboard summary
exports.getDashboardData = async (req, res) => {
  try {
    const [chefs, orders, tables] = await Promise.all([
      Chef.find(),
      Order.find(),
      Table.find()
    ]);

    const totalRevenue = orders.reduce((sum, o) =>
      sum + (o.cartItems?.reduce((s, i) => s + i.price * i.quantity, 0) || 0)
    , 0);

    const dineIn     = orders.filter(o => o.orderType?.toLowerCase().includes("dine")).length;
    const takeAway   = orders.filter(o => o.orderType?.toLowerCase().includes("take")).length;
    const totalClients = new Set(orders.map(o => o.user?.mobile).filter(Boolean)).size;

    const chefStats = chefs.map(c => ({
      _id: c._id,
      name: c.name,
      orderCount: orders.filter(o =>
        o.chef === c._id.toString() || o.chef === c.name
      ).length
    }));

    const reservedCount  = tables.filter(t => t.isReserved).length;
    const availableCount = tables.length - reservedCount;

    res.json({
      totalChef: chefs.length,
      totalRevenue,
      totalOrders: orders.length,
      totalClients,
      orderSummary: { dineIn, takeAway },
      tableStats:   { reserved: reservedCount, available: availableCount },
      chefs: chefStats,
      tables,
      orders
    });
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// — Add a new chef
exports.addChef = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Chef name required" });

    if (await Chef.findOne({ name: name.trim() })) {
      return res.status(409).json({ error: "Chef already exists" });
    }

    const chef = new Chef({ name: name.trim() });
    await chef.save();
    res.status(201).json(chef);
  } catch (err) {
    console.error("Add Chef error:", err);
    res.status(500).json({ error: "Failed to add chef" });
  }
};

// — List all chefs
exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    console.error("Get Chefs error:", err);
    res.status(500).json({ error: "Failed to fetch chefs" });
  }
};

// — Increment a chef’s orderCount
exports.incrementOrderCount = async (req, res) => {
  try {
    const { chefId } = req.params;
    const chef = await Chef.findById(chefId);
    if (!chef) return res.status(404).json({ error: "Chef not found" });

    chef.orderCount += 1;
    await chef.save();
    res.json(chef);
  } catch (err) {
    console.error("Increment Chef error:", err);
    res.status(500).json({ error: "Failed to increment order count" });
  }
};
