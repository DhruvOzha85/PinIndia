const express = require("express");
const router = express.Router();
const Pincode = require("../models/Pincode");

// GET /api/pincodes?state=&district=&taluk=&page=1&limit=20
router.get("/", async (req, res, next) => {
  try {
    const { state, district, taluk, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (state) filter.stateName = new RegExp(`^${state}$`, "i");
    if (district) filter.districtName = new RegExp(`^${district}$`, "i");
    if (taluk) filter.taluk = new RegExp(`^${taluk}$`, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Pincode.find(filter).skip(skip).limit(parseInt(limit)).lean(),
      Pincode.countDocuments(filter),
    ]);

    res.json({ data, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/search?q=adi
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const orQuery = [
      { officeName: regex },
      { districtName: regex },
      { stateName: regex },
      { taluk: regex },
    ];

    if (!isNaN(q) && q.trim() !== "") {
      orQuery.push({ pincode: Number(q) });
    }

    const results = await Pincode.find({ $or: orQuery })
      .limit(10)
      .lean();

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/pincode/:pincode
router.get("/:pincode", async (req, res, next) => {
  try {
    const { pincode } = req.params;
    const records = await Pincode.find({ pincode }).lean();
    if (!records.length) {
      return res.status(404).json({ message: "Pincode not found" });
    }
    res.json(records);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
