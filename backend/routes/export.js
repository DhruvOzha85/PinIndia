const express = require("express");
const router = express.Router();
const Pincode = require("../models/Pincode");
const { Parser } = require("json2csv");

// GET /api/export?state=&district=&taluk=
router.get("/", async (req, res, next) => {
  try {
    const { state, district, taluk } = req.query;
    const filter = {};

    if (state) filter.stateName = state.toUpperCase();
    if (district) filter.districtName = district.toUpperCase();
    if (taluk) filter.taluk = taluk.toUpperCase();

    const records = await Pincode.find(filter).lean();

    if (!records.length) {
      return res.status(404).json({ message: "No records found for export" });
    }

    const fields = [
      "pincode",
      "officeName",
      "officeType",
      "deliveryStatus",
      "taluk",
      "districtName",
      "stateName",
      "divisionName",
      "regionName",
      "circleName",
      "telephone",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    const filename = [state, district, taluk].filter(Boolean).join("_") || "all";
    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", `attachment; filename="pincodes_${filename}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
