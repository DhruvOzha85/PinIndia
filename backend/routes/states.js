const express = require("express");
const router = express.Router();
const Pincode = require("../models/Pincode");

// GET /api/states — all distinct states
router.get("/", async (req, res, next) => {
  try {
    const states = await Pincode.distinct("stateName");
    res.json(states.filter(Boolean).sort());
  } catch (err) {
    next(err);
  }
});

// GET /api/states/:state — list cities based on district
router.get("/:state", async (req, res, next) => {
  try {
    const { state } = req.params;
    // Check if the parameter is "districts" to avoid collision if mounted at root level with specific logic
    // But since this is states Router, /:state is always state name.
    
    const results = await Pincode.aggregate([
      { $match: { stateName: new RegExp(`^${state}$`, "i") } },
      { $group: { _id: "$districtName", cities: { $addToSet: "$officeName" } } },
      { $sort: { _id: 1 } },
    ]);

    if (!results.length) {
      return res.status(404).json({ message: "State not found" });
    }

    const formatted = {};
    results.forEach((r) => {
      formatted[r._id] = r.cities.sort();
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// GET /api/states/:state/districts
router.get("/:state/districts", async (req, res, next) => {
  try {
    const { state } = req.params;
    const districts = await Pincode.distinct("districtName", {
      stateName: new RegExp(`^${state}$`, "i"),
    });
    res.json(districts.filter(Boolean).sort());
  } catch (err) {
    next(err);
  }
});

// GET /api/states/:state/districts/:district/taluks
router.get("/:state/districts/:district/taluks", async (req, res, next) => {
  try {
    const { state, district } = req.params;
    const taluks = await Pincode.distinct("taluk", {
      stateName: new RegExp(`^${state}$`, "i"),
      districtName: new RegExp(`^${district}$`, "i"),
    });
    res.json(taluks.filter(Boolean).sort());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
