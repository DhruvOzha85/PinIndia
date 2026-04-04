const express = require("express");
const router = express.Router();
const Pincode = require("../models/Pincode");

// GET /api/stats
router.get("/", async (req, res, next) => {
  try {
    const [totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices] =
      await Promise.all([
        Pincode.countDocuments(),
        Pincode.distinct("stateName").then((s) => s.filter(Boolean).length),
        Pincode.countDocuments({ deliveryStatus: /delivery/i }),
        Pincode.countDocuments({ deliveryStatus: /non-delivery/i }),
      ]);

    res.json({ totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/state-distribution
router.get("/state-distribution", async (req, res, next) => {
  try {
    const data = await Pincode.aggregate([
      { $group: { _id: "$stateName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, state: "$_id", count: 1 } },
    ]);
    res.json(data.filter((d) => d.state));
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/delivery-distribution
router.get("/delivery-distribution", async (req, res, next) => {
  try {
    const data = await Pincode.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: "$deliveryStatus", regex: /non/i } },
              "Non-Delivery",
              "Delivery",
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { delivery: 0, nonDelivery: 0 };
    data.forEach((d) => {
      if (d._id === "Delivery") result.delivery = d.count;
      else result.nonDelivery = d.count;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
