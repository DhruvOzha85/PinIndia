const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema(
  {
    pincode: { type: Number, index: true },
    officeName: { type: String },
    officeType: { type: String },       // HO / SO / BO
    deliveryStatus: { type: String },   // Delivery / Non-Delivery
    divisionName: { type: String },
    regionName: { type: String },
    circleName: { type: String },
    taluk: { type: String },
    districtName: { type: String },
    stateName: { type: String },
    telephone: { type: String },
    relatedSubOffice: { type: String },
    relatedHeadOffice: { type: String },
  },
  { collection: "pincode" }
);

// Text index for search
pincodeSchema.index({
  pincode: "text",
  officeName: "text",
  districtName: "text",
  stateName: "text",
  taluk: "text",
});

module.exports = mongoose.model("Pincode", pincodeSchema);
